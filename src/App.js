import React, { Component } from 'react';
import './App.css';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';

import 'tachyons';
import Particles from 'react-particles-js';

// Face Detection model we will be using: https://www.clarifai.com/models/face-detection 

// How we will use the API with JS (don't worry I will show you the easy way to do this): https://github.com/Clarifai/clarifai-javascript#basic-use

const app = new Clarifai.App({
  apiKey: "3d89fc08bddf4b4aa89fb9819ac11a1a",
 });

 const initialState = {
    input: '',
    image: '',
    box: {},
    route: 'signin',
    isSignedIn: false,
    user: {
        id: '',
        name: '',
        email: '',
        password: '',
        entries: 0,
        joined: ''
    }
}
class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      image: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
          id: '',
          name: '',
          email: '',
          password: '',
          entries: 0,
          joined: ''
      }
    }
  }

  // componentDidMount() {
  //   // be wary if you use http or https
  //   fetch('http://localhost:3000')
  //     .then(response => response.json())
  //     // .then(data => console.log(data));
  //     .then(console.log);
  // }

  loadUser = (data) => {
    this.setState( {user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }});
  }


  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    // we will now do DOM manipulation, make sure to give an id to your image
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    // console.log(width, height, clarifaiFace);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
    
  }

  displayFaceBox = (box) => {
    this.setState({box:box});
  }

  onButtonSubmit = () => {
    this.setState( {imageUrl: this.state.input})
    console.log("click");
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL,
      // Clarifai.COLOR_MODEL,
      // imageURL
      this.state.input
    ).then(response =>  {
        if(response) {
          fetch('http://localhost:3000/image',{
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              // when you just want to assign a value but not replace the whole thing
              this.setState(Object.assign(this.state.user, {entries: count}))
            })
            .catch(console.log)
        }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(err)
    );
  };
  
  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState( initialState );
    } else if ( route === 'home') {
      this.setState( {isSignedIn: true} ); 
    }
    this.setState({route: route});
  }


  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles className='particles' params={particlesOptions}/>
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home'
          ?
            <div>
              <Logo />
              <Rank 
                name={this.state.user.name} 
                entries={this.state.user.entries} />
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit}/>
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>
            
          : (route === 'register'
              ? <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
              : <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> 
          )          
        }
      </div>
    )
  }
}




const particlesOptions = {
  "particles": {
    "number": {
      "value": 50,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#000000"
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#000000"
      },
      "polygon": {
        "nb_sides": 5
      },
      "image": {
        "src": "img/github.svg",
        "width": 100,
        "height": 100
      }
    },
    "opacity": {
      "value": 0.5,
      "random": false,
      "anim": {
        "enable": false,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 5,
      "random": true,
      "anim": {
        "enable": false,
        "speed": 40,
        "size_min": 0.1,
        "sync": false
      }
    },
    "line_linked": {
      "enable": true,
      "distance": 150,
      "color": "#000000",
      "opacity": 0.4,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 6,
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "repulse"
      },
      "onclick": {
        "enable": true,
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 400,
        "line_linked": {
          "opacity": 1
        }
      },
      "bubble": {
        "distance": 400,
        "size": 40,
        "duration": 2,
        "opacity": 8,
        "speed": 3
      },
      "repulse": {
        "distance": 200,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true
}

export default App;
