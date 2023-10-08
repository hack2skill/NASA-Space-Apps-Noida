import pdfkit
from flask import Flask, render_template, make_response, request
from flask_cors import CORS
app = Flask(__name__)
CORS(app, resources={r'/*': {'origins': '*'}})
@app.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        # Variables to pass to the template
        data = request.get_json()
        name = data.get('name') 
        source = data.get('source')
        print(source)
        destination = data.get('destination')
        srcdistance = data.get('srcdistance', '35')
        planet = destination + '.html' if destination else None


        planet_weather = {
            'Mercury': 'extremely hot during the day, extremely cold at night',
            'Venus': 'hot and cloudy with sulfuric acid clouds',
            'Earth': 'mild with variable climates',
            'Mars': 'cold and dry with thin atmosphere',
            'Jupiter': 'extremely cold with violent storms',
            'Saturn': 'extremely cold with high-speed winds',
            'Uranus': 'cold with a cloudy and hazy atmosphere',
            'Neptune': 'extremely cold and windy',
            'Pluto': 'extremely cold and rocky'
        }
        # Render the Jinja2 template to a string
        html = render_template(planet, name=name, source=source, destination=destination, srcdistance=srcdistance, srcatmosphere=planet_weather[source], dstatmosphere=planet_weather[destination])

        # Create a PDF from the HTML string
        pdf = pdfkit.from_string(html, False)

        # Create a response with the PDF data
        response = make_response(pdf)
        response.headers['Content-Type'] = 'application/pdf'
        response.headers['Content-Disposition'] = f'inline; filename={destination}_itinerary.pdf'

        return response
    else:
        return "This endpoint accepts POST requests only."

if __name__ == '__main__':
    app.run(debug=True)
