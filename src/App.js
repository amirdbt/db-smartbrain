import React from 'react';
import Navigation from './components/Navigation/Navigation'
import Logo  from './components/Logo/Logo'
import ImageLinkForm  from './components/ImageLinkForm/ImageLinkForm'
import Rank  from './components/Rank/Rank'
import FaceRecognition  from './components/FaceRecognition/FaceRecognition'
import Signin  from './components/Signin/Signin'
import Register from './components/Register/Register'
import Particles from 'react-particles-js';
import Clarifai from 'clarifai'
import './App.css';

const app = new Clarifai.App({
  apiKey: 'b1645a48c843483e875d4b883158d63f'
 });
 
const particlesOptions ={
    particles: {
      number:{
        value: 130,
        density:{
          enable:true,
          value_area:800
        }
      }    
    }
  }

class App extends React.Component{
  constructor(){
    super()
    this.state ={
      input : "",
      imageUrl : "",
      box: {},
      route: 'signin',
      isSignedIn: false,
      user:{
            id: "",
            name: "",
            password: "",
            email: "",
            entries: 0,
            joined: ''
      }
    }
  }

  loadUser=(data)=>{
    this.setState({
      user:{
        id: data.id,
        name: data.name,
        password: data.password,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    })
  }

  calculateFaceLocation =(data)=>{
   const clarifaiFace= data.outputs[0].data.regions[0].region_info.bounding_box
   const image = document.getElementById('inputimage')
   const width = Number(image.width)
   const height = Number(image.height)
   
   return{
     leftCol : clarifaiFace.left_col * width,
     topRow : clarifaiFace.top_row * height,
     rightCol : width - ( clarifaiFace.right_col * width),
     bottomRow : height - ( clarifaiFace.bottom_row * height)
   }
  }

  displayFaceBox = (box)=>{
    console.log(box)
    this.setState({
      box:box
    })
  }

    onInputChange =(event)=>{
      const {value} = event.target
    this.setState({
      input:value
    })
    }

    onSubmit=()=>{
      this.setState({imageUrl: this.state.input })

      app.models.predict(Clarifai.FACE_DETECT_MODEL ,this.state.input)

          .then((response) => {
            if(response){
              fetch("https://serene-brushlands-03305.herokuapp.com/image",{
                method : "put",
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    id: this.state.user.id,
                    
                })
            })
            .then(response => response.json())
            .then(count =>{
              this.setState(Object.assign(this.state.user,{entries:count}))
            })
            }
            
            this.displayFaceBox(this.calculateFaceLocation(response))
          })
          .catch(err => console.log(err))    
  
    }
    onRouteChange = (route) =>{
      if(route === 'signout'){
        this.setState({isSignedIn:false})
      }
      else if(route === 'home')
      {
        this.setState({isSignedIn :true})
      }
      this.setState({route: route})
    }

    render() {
      return (
        <div className="App">
          <Particles className="particles" params={particlesOptions} />
          <Navigation onRouteChange={this.onRouteChange} isSignedIn={this.state.isSignedIn} />
          {this.state.route === 'home' ?   <div>
            <Logo />
            <Rank  name={this.state.user.name} entries={this.state.user.entries} />
            <ImageLinkForm inputChange={this.onInputChange} onSubmit={this.onSubmit} />
            <FaceRecognition imageUrl={this.state.imageUrl} box={this.state.box} />
          </div> 
          :
          (
            this.state.route === 'signin' ?
            <Signin  onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
            :  <Register  onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
          )
         }
        
    </div>
      );
    }
  
  }

export default App;
