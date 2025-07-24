from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import random

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

# Helper to randomize board

def randomize_board():
    positions = list(range(2, 100))
    random.shuffle(positions)
    terrorists = sorted(positions[:10])  # Fewer terrorists
    caves = sorted(positions[10:20])    # More caves
    knives = sorted(positions[20:35])   # More knives
    traps = sorted(positions[35:45])    # Fewer traps
    explosives = sorted(positions[45:55])  # 10 explosives
    # Get two random positions for additional hospitals
    hospital_positions = sorted(random.sample(positions[55:], 2))
    return {
        'size': 100,
        'terrorists': terrorists,
        'caves': caves,
        'hospitals': [1] + hospital_positions,  # One fixed at 1, two random
        'knives': knives,
        'traps': traps,
        'explosives': explosives
    }

def reset_game_state():
    global game_state
    game_state = {
        'players': {
            'player1': {'position': 0, 'knives': 0, 'skip_turn': False, 'extra_turn': False},
            'player2': {'position': 0, 'knives': 0, 'skip_turn': False, 'extra_turn': False}
        },
        'board': randomize_board()
    }

@app.route('/')
def index():
    reset_game_state()
    return render_template('index.html')

@socketio.on('join_game')
def handle_join(data):
    emit('game_state', game_state, broadcast=True)
    emit('game_start', broadcast=True)

@socketio.on('roll_dice')
def handle_roll(data):
    player_id = data['player_id']
    if player_id not in game_state['players']:
        return
    player = game_state['players'][player_id]
    if player['skip_turn']:
        player['skip_turn'] = False
        emit('game_state', game_state, broadcast=True)
        return
    # Dice: 1-6, fair
    dice = random.choices([1,2,3,4,5,6], weights=[2,2,2,2,2,2])[0]
    new_position = player['position'] + dice
    # Knives
    if new_position in game_state['board']['knives']:
        player['knives'] += 1
    # Traps
    elif new_position in game_state['board']['traps']:
        player['skip_turn'] = True
    # Explosives
    elif new_position in game_state['board']['explosives']:
        # Find nearest hospital
        hospitals = game_state['board']['hospitals']
        nearest_hospital = min(hospitals, key=lambda x: abs(x - new_position))
        new_position = nearest_hospital
        player['skip_turn'] = True  # Skip next turn
    # Terrorists
    elif new_position in game_state['board']['terrorists']:
        # Find nearest hospital
        hospitals = game_state['board']['hospitals']
        nearest_hospital = min(hospitals, key=lambda x: abs(x - new_position))
        new_position = nearest_hospital
    # Caves (ladder logic)
    elif new_position in game_state['board']['caves']:
        caves = sorted(game_state['board']['caves'])
        idx = caves.index(new_position)
        if idx < len(caves) - 1:
            new_position = caves[idx + 1]  # Go to next cave
    # Kill other player
    other_player_id = next(pid for pid in game_state['players'] if pid != player_id)
    if player['knives'] > 0 and new_position == game_state['players'][other_player_id]['position']:
        game_state['players'][other_player_id]['position'] = 0
        player['knives'] -= 1
    player['position'] = min(new_position, game_state['board']['size'])
    # Extra turn if dice is 6
    if dice == 6:
        player['extra_turn'] = True
    else:
        player['extra_turn'] = False
    # Win condition
    if player['position'] == game_state['board']['size']:
        emit('game_over', {'winner': player_id}, broadcast=True)
    emit('game_state', game_state, broadcast=True)
    # If extra turn, notify frontend
    if player['extra_turn']:
        emit('extra_turn', {'player': player_id}, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True) 