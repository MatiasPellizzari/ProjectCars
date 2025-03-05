from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

people_list = []
championship_list = []
senior_list = []
score_list = []
participation_score = None

def find_closest_match(name, championship_names):
    """Finds the closest match for a given name using a simple similarity check."""
    best_match = None
    best_score = 0

    for champ_name in championship_names:
        # Basic similarity: count common words
        common_words = set(name.split()) & set(champ_name.split())
        score = len(common_words)  # More common words = better match

        if score > best_score:
            best_score = score
            best_match = champ_name

    return best_match if best_score > 0 else "No match found"

def calculate_score(position):
    index = position - 1  # Convert 1-based position to 0-based index
    if index < 0:
        return 0  # Safety check, shouldn't happen
    if index >= len(score_list):
        return score_list[-1]  # Use last score if position exceeds list
    return score_list[index]  # Corrected index usage

# Saves the new senior list
def save_senior_list():
    with open("senior_list.json", "w") as f:
        json.dump(senior_list, f)

# Loads the senior list to be shown 
def load_senior_list():
    global senior_list
    try:
        with open("senior_list.json", "r") as f:
            senior_list = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
            return jsonify({"error": f"Error loading senior file"}), 500  


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

    global senior_list, score_list, participation_score, championship_list
    championship_list = []
    
    try:
        # Read and parse JSON file
        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)  # Load full JSON object

        # Extract values
        senior_list = data.get("senior_list", [])  
        score_list = data.get("score_list", [])
        participation_score = data.get("participation_score", 0)  
        championship_list = data.get("championship_list", [])

        # Ensure key consistency in championship_list
        for person in championship_list:
            person["Fastest Lap"] = person.pop("Fastest_Lap", None)

        # Sort championship_list by position
        championship_list.sort(key=lambda x: x['Position'])

        return jsonify({
            "message": "Championship loaded successfully",
            "senior_list": senior_list,
            "score_list": score_list,
            "participation_score": participation_score,
            "championship_list": championship_list
        })

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
        person['Score'] = calculate_score(i + 1) + participation_score  # i+1 because i is 0-based
        championship_list.append(person)

    return jsonify({"message": "Championship started successfully", "championship_list": championship_list})

# Update a championship
@app.route('/api/update_championship', methods=['POST'])
def update_championship():
    if 'file' not in request.files:
        return jsonify({"status": "error", "error": "File not found in request"}), 400

    file = request.files['file']

    # Ensure the uploads directory exists
    if not os.path.exists('./uploads'):
        os.makedirs('./uploads')

    file_path = f"./uploads/{file.filename}"
    file.save(file_path)

    global people_list, championship_list
    people_list = []
    unrecognized_drivers = []  # 🚨 Track drivers not in championship list

    # Asegurarse de que championship_list tiene datos válidos
    if not championship_list or not isinstance(championship_list, list):
        return jsonify({"status": "error", "error": "Championship list is empty or invalid, cannot update"}), 400

    # Extract names from the leaderboard (asegurar que sea una lista de strings)
    championship_names = [p['Name'] for p in championship_list if isinstance(p, dict) and 'Name' in p]

    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            for line in file:
                parts = line.strip().split('\t')

                if len(parts) < 4:
                    continue  

                try:
                    position = int(parts[0])
                    name = parts[1]
                    fastest_lap = float(parts[3])  

                    person = {'Position': position, 'Name': name, 'Score': 0, 'Fastest Lap': fastest_lap}
                    people_list.append(person)

                except ValueError:
                    continue  

        for person in people_list:
            position = person['Position']
            score = calculate_score(position)

            found = False
            for champ_person in championship_list:
                if champ_person['Name'] == person['Name']:
                    champ_person['Score'] += score  
                    found = True
                    break  # Stop searching if we found a match

            if not found:
                closest_match = find_closest_match(person['Name'], championship_names)
                unrecognized_drivers.append({"name": person['Name'], "closest_match": closest_match})

        # Debugging: Imprimir los datos antes de enviar la respuesta
        print("Unrecognized Drivers:", unrecognized_drivers)
        print("Leaderboard Names:", championship_names)

        # Si hay pilotos no reconocidos, enviar una advertencia sin detener el flujo
        if unrecognized_drivers:
            return jsonify({
                "status": "warning",
                "message": "Some drivers were not found in the leaderboard. The update was not applied.",
                "unrecognized_drivers": unrecognized_drivers,
                "leaderboard_names": championship_names  # Asegurar que es una lista de strings
            }), 200

        # Ordenar por Score si todos los pilotos fueron reconocidos
        championship_list.sort(key=lambda x: x['Score'], reverse=True)

        return jsonify({
            "status": "success",
            "message": "Championship updated successfully",
            "championship_list": championship_list
        }), 200
    except Exception as e:
        print("Error en update_championship:", str(e))  # Agregar logs para depuración
        return jsonify({"status": "error", "error": str(e)}), 500
    
# Show the current championship list
@app.route('/api/show_championship', methods=['GET'])
def show_championship():
    print(championship_list)  # Debugging: Log the data
    return jsonify({"championship_list": championship_list})

# Show the current senior championship list
@app.route('/api/show_senior_championship', methods=['GET'])
def show_senior_championship():
    print(senior_list)  # Debugging: Log the data
    return jsonify({"senior_list": senior_list})

# Download the championship as a .txt file to resume it later
@app.route('/api/download_file', methods=['POST'])
def save_championship_to_txt():
    # Extract the file_name from the JSON body
    data = request.json
    file_name = data.get('file_name')  # Get the file_name parameter from the JSON payload

    if not file_name:
        return jsonify({"error": "File name is required"}), 400

    try:
        # Prepare data in the correct order
        championship_data = {
            "senior_list": senior_list,
            "score_list": score_list,
            "participation_score": participation_score,
            "championship_list": [
                {
                    "Position": person["Position"],
                    "Name": person["Name"],
                    "Score": person["Score"],
                    "Fastest_Lap": person["Fastest Lap"]  # Rename key
                }
                for person in championship_list
            ]
        }

        # Save as formatted JSON
        with open(file_name, 'w', encoding='utf-8') as file:
            json.dump(championship_data, file, indent=4)  

        return jsonify({"message": f"File '{file_name}' saved successfully."}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

#Shows the pilots that are in people_list but not in senior_list
@app.route("/api/available_people", methods=["GET"])
def get_available_people():
    available_people = [p for p in people_list if p not in senior_list]
    return jsonify({"available_people": available_people})

@app.route('/api/move_to_senior', methods=['POST'])
def move_to_senior():
    data = request.json
    name = data.get("name")

    # Find person in championship_list
    person = next((p for p in championship_list if p["Name"] == name), None)
    
    if person:
        senior_list.append(person)  # Add to senior list
        save_senior_list()  # Persist changes
        return jsonify({"message": f"{name} moved to Senior Leaderboard."})
    
    return jsonify({"error": "Person not found"}), 404

@app.route('/api/set_score_list', methods=['POST'])
def set_score_list():
    global score_list
    try:
        data = request.get_json()
        if "score_list" not in data or not isinstance(data["score_list"], list):
            return jsonify({"error": "Invalid score list format"}), 400
        
        score_list = data["score_list"]
        print("✅ Score List Updated:", score_list)  # Debugging

        return jsonify({"message": "Score list saved successfully", "score_list": score_list}), 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return jsonify({"error": "Failed to set score list"}), 500
    
@app.route('/api/set_participation_score', methods=['POST'])
def set_participation_score():
    global participation_score
    try:
        data = request.get_json()
        if "participation_score" not in data or not isinstance(data["participation_score"], int):
            return jsonify({"error": "Invalid participation score format"}), 400
        
        participation_score = data["participation_score"]
        print("✅ Participation Score Updated:", participation_score)  # Debugging

        return jsonify({"message": "Participation score saved successfully", "participation_score": participation_score}), 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return jsonify({"error": "Failed to set participation score"}), 500   


if __name__ == '__main__':
    app.run(debug=True)