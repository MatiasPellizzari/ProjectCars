from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

people_list = []
championship_list = []

# Define the function to calculate scores
def calculate_score(position):
    return max(0, 6 - 2 * (position - 1))

# Save championship to a .txt file
@app.route('/api/save_championship', methods=['POST'])
def save_championship():
    file_name = request.json.get('file_name', 'championship.txt')
    with open(file_name, 'w') as file:
        file.write('[' + '\n')
        for person in championship_list:
            file.write(str(person) + ',' + '\n')
        file.write(']')
    return jsonify({"message": "Championship saved successfully", "file_name": file_name})

# Load championship from a .txt file
@app.route('/api/load_championship', methods=['POST'])
def load_championship():
    file_path = request.json.get('file_path')
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404

    global championship_list
    with open(file_path, 'r') as file:
        championship_data = eval(file.read())  # Read and evaluate the content as Python code

    championship_list = []
    for data in championship_data:
        person = {
            'Position': data['Position'],
            'Name': data['Name'],
            'Score': data['Score'],
            'Fastest Lap': data['Fastest Lap']
        }
        championship_list.append(person)

    return jsonify({"message": "Championship loaded successfully", "championship_list": championship_list})

@app.route('/api/begin_championship', methods=['POST'])
def begin_championship():
    if 'file' not in request.files:
        return jsonify({"error": "File not found in request"}), 400

    file = request.files['file']

    # Save the file temporarily
    file_path = f"./uploads/{file.filename}"
    file.save(file_path)

    # Your existing logic
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404

    global people_list, championship_list
    people_list = []
    championship_list = []

    with open(file_path, 'r') as file:
        for line in file:
            parts = line.strip().split('\t')
            position = int(parts[0])
            name = parts[1]
            fastest_lap = float(parts[3])  # Convert to float

            person = {'Position': position, 'Name': name, 'Score': 0, 'Fastest Lap': fastest_lap}
            people_list.append(person)

    # Sort people_list based on position
    sorted_people_list = sorted(people_list, key=lambda x: x['Position'])

    # Update championship_list with scores
    for i, person in enumerate(sorted_people_list):
        person['Score'] = calculate_score(i + 1)  # i+1 because i is 0-based
        championship_list.append(person)

    return jsonify({"message": "Championship started successfully", "championship_list": championship_list})
# Update a championship
@app.route('/api/update_championship', methods=['POST'])
def update_championship():
    file_path = request.json.get('file_path')
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404

    global people_list, championship_list
    people_list = []

    with open(file_path, 'r') as file:
        for line in file:
            parts = line.strip().split('\t')
            position = int(parts[0])
            name = parts[1]
            fastest_lap = float(parts[3])  # Convert to float

            person = {'Position': position, 'Name': name, 'Score': 0, 'Fastest Lap': fastest_lap}
            people_list.append(person)

    for person in people_list:
        position = person['Position']
        score = calculate_score(position)

        # Find the corresponding person in championship_list
        for champ_person in championship_list:
            if champ_person['Name'] == person['Name']:
                # Add the score from the current race to the total score
                champ_person['Score'] += score

    return jsonify({"message": "Championship updated successfully", "championship_list": championship_list})

# Show the current championship list
@app.route('/api/show_championship', methods=['GET'])
def show_championship():
    return jsonify({"championship_list": championship_list})

if __name__ == '__main__':
    app.run(debug=True)