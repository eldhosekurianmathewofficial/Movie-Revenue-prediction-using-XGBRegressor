from flask import Flask, render_template, request, jsonify
import pickle
import pandas as pd

app = Flask(__name__)
df = pd.read_csv("director_with_date_info.csv")

# Load the pickled regression model
with open('model.pkl', 'rb') as model_file:
    regression_model = pickle.load(model_file)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
@app.route('/predict', methods=['POST'])
def predict():
    print("Received POST request at /predict")
    genre = int(request.form['genre'])
    actor_popularity = float(request.form['actorPopularity'].split(': ')[1])
    actress_popularity = float(request.form['actressPopularity'].split(': ')[1])
    director_popularity = float(request.form['directorPopularity'].split(': ')[1])
    budget = float(request.form['budget'])
    popularity = float(request.form['popularity'])
    runtime = float(request.form['runtime'])
    release_year = int(request.form['release_year'])
    release_month = int(request.form['release_month'])
    release_day = int(request.form['release_day'])
    vote_average = float(request.form['vote_average'])
    vote_count = float(request.form['vote_count'])
    original_language = int(request.form['original_language'])

    popularity_string1 = request.form['actorPopularity']
    numeric_part = popularity_string1.replace('Popularity: ', '')
    print(f"genre: {genre}, actor_popularity: {actor_popularity}, actress_popularity: {actress_popularity}, director_popularity: {director_popularity}")
    try:
        actor_popularity = float(numeric_part)
    except ValueError as e:
        print(f"Error converting to float: {e}")

    popularity_string2 = request.form['actressPopularity']
    numeric_part = popularity_string2.replace('Popularity: ', '')

    try:
        actress_popularity = float(numeric_part)
    except ValueError as e:
        print(f"Error converting to float: {e}")

    popularity_string3 = request.form['directorPopularity']
    numeric_part = popularity_string3.replace('Popularity: ', '')

    try:
        director_popularity = float(numeric_part)
    except ValueError as e:
        print(f"Error converting to float: {e}")

    # Create a feature array from the input data
    features = {
        'budget': budget,
        'popularity': popularity,
        'runtime': runtime,
        'vote_average': vote_average,
        'vote_count': vote_count,
        'Popularity_Actor': actor_popularity,
        'Popularity_Actress': actress_popularity,
        'Popularity_Director': director_popularity,
        'genre': genre,
        'original_language': original_language,
        'release_year': release_year,
        'release_month': release_month,
        'release_day': release_day
    }

    # Make a prediction using the regression model
    prediction = regression_model.predict(pd.DataFrame([features]))

    # Format the prediction result
    result = f'The predicted revenue is: $ {prediction[0]:,.2f}  or Rs.{prediction[0]*83}'

    return jsonify({'result': result})

@app.route('/get_actor_popularity')
def get_actor_popularity():
    actor_name = request.args.get('actor')
    try:
        actor_popularity = df[df['Main_Actor'] == actor_name]['Popularity_Actor'].values[0]
        return jsonify({'popularity': actor_popularity})
    except IndexError:
        return "Actor not found in the DataFrame"


@app.route('/get_actress_popularity')
def get_actress_popularity():
    actress_name = request.args.get('actress')
    try:
        actress_popularity = df[df['Main_Actress'] == actress_name]['Popularity_Actress'].values[0]
        return jsonify({'popularity': actress_popularity})
    except IndexError:
        return "Actress not found in the DataFrame"


@app.route('/get_director_popularity')
def get_director_popularity():
    director_name = request.args.get('director')
    # Get director popularity from the DataFrame
    director_popularity = df[df['Director'] == director_name]['Popularity_Director'].values[0]
    return jsonify({'popularity': director_popularity})



if __name__ == '__main__':
    app.run(debug=True)
