from flask import Flask






app = Flask(__name__)




@app.route('/')
def idx():
	t = open('./index.html','r')
	r = t.read()
	t.close()
	return r



@app.route('/get/<num_rows>')
def dataset(num_rows):
	d = create_data(int(num_rows))
	return d




if __name__=='__main__':
	app.run(debug=False, host='localhost',port=1000)


