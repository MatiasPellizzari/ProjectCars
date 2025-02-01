from flask import Flask, request, jsonify
from flask_cors import CORS
import json
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
    if 'file' not in request.files:
        return jsonify({"error": "File not found in request"}), 400

    file = request.files['file']

    # Ensure the uploads directory exists
    if not os.path.exists('./uploads'):
        os.makedirs('./uploads')

    file_path = f"./uploads/{file.filename}"
    file.save(file_path)

    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404

    global championship_list
    championship_list = []

    try:
        # Read and parse JSON file
        with open(file_path, 'r', encoding='utf-8') as file:
            championship_list = json.load(file)

        # Ensure key consistency
        for person in championship_list:
            person["Fastest Lap"] = person.pop("Fastest_Lap", None)  # Rename key if needed

        # Sort by position
        championship_list.sort(key=lambda x: x['Position'])

        return jsonify({"message": "Championship loaded successfully", "championship_list": championship_list})

    except json.JSONDecodeError:
        return jsonify({"error": "Invalid JSON format in file"}), 400
    except Exception as e:
        return jsonify({"error": f"Error processing file: {str(e)}"}), 500
    
@app.route('/api/begin_championship', methods=['POST'])
def begin_championship():
    if 'file' not in request.files:
        return jsonify({"error": "File not found in request"}), 400

    file = request.files['file']

    file_path = f"./uploads/{file.filename}"
    file.save(file_path)

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
    if 'file' not in request.files:
        return jsonify({"error": "File not found in request"}), 400

    file = request.files['file']

    file_path = f"./uploads/{file.filename}"
    file.save(file_path)

    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404

    global people_list, championship_list
    people_list= []

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
    print(championship_list)  # Debugging: Log the data
    return jsonify({"championship_list": championship_list})

# Download the championship as a .txt file to resume it later
@app.route('/api/download_file', methods=['POST'])
def save_championship_to_txt():
    # Extract the file_name from the JSON body
    data = request.json
    file_name = data.get('file_name')  # Get the file_name parameter from the JSON payload

    if not file_name:
        return jsonify({"error": "File name is required"}), 400

    try:
        # Convert data to valid JSON format
        formatted_championship_list = [
            {
                "Position": person["Position"],
                "Name": person["Name"],
                "Score": person["Score"],
                "Fastest_Lap": person["Fastest Lap"]  # Rename key
            }
            for person in championship_list
        ]

        with open(file_name, 'w', encoding='utf-8') as file:
            json.dump(formatted_championship_list, file, indent=4)  # Write as formatted JSON
        
        return jsonify({"message": f"File '{file_name}' saved successfully."}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
        
if __name__ == '__main__':
    app.run(debug=True)