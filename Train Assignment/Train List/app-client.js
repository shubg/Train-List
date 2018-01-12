import { Router, Route, Link, browserHistory } from 'react-router';
import { render } from 'react-dom';
import React from 'react';

const Navbar = React.createClass({
  render(){
    return (
        <nav>
            <div className="nav-wrapper">
                <ul id="nav-mobile" className="left hide-on-med-and-down">
                    <Link to='/'><li className='brand-logo center'>FP Tech Assignment</li></Link>
                </ul>
            </div>
        </nav>
    );
  }
});

const TrainELemStyle  = {
  height: '30px',
  width: '800px',
  textAlign: 'left',
  border: '1px solid #aaaaaa'
};

const inputBoxStyle = {
  display: "inline-block",
  width: "60px",
  height: "15px",
  margin: "5px",
  border: "1px solid #3333"
};

const outerContainerStyle = {
  width: '800px',
  height: '500px',
  border: '1px dashed #aaaaaa'
};

const TrainListStyle = {
  width: '800px',
  height: '370px'
};

 const dragDropAreaStyle = {
   width: '780px',
   height: '100px',
   padding: '10px',
   border: '1px dashed #aaaaaa'
 };

const Train = React.createClass({
   render(){
      var key = this.props.id + 1;
      var trainData = this.props.data;
      var ArrivalId = "Arrival" + key;
      var DepartureId = "Departure" + key;
      if (!trainData.locomotive && !trainData.carriage) {
        return null;
      }
        return (
          <div className="TrainELem" id={key} style={TrainELemStyle} onDrop={this.props.ondropFunc} onDragOver={this.props.allowDropFunc}>
            <span> Train Number {key}({trainData.locomotive} locomotives and {trainData.carriage} carriages)</span>
            <span style={{float: 'right'}}>
            <input type="text" style={inputBoxStyle} id={ArrivalId}/>
            <input type="text" style={inputBoxStyle} id={DepartureId}/>
            </span>
          </div>

        );
    }
});

const TrainList = React.createClass({
      getInitialState() {
          return {
            TRAINS: [],
            locomotive: 0,
            carriage: 0
          };
      },

      calculateTrackClicked () {
        var numTrain = this.state.TRAINS.length;
        var arr = [];
        var dep = [];
        for (var i=1; i<=numTrain; i++) {
           var arrTime = document.getElementById('Arrival' + i).value;
           var depTime = document.getElementById('Departure' + i).value;
           arr.push(arrTime);
           dep.push(depTime);
        }
         alert ('Max number of platforms - ' + this.getmaxPlatforms(arr, dep, numTrain));
     },

     getmaxPlatforms (arr, dep, numTrain) {
       var platform_needed = 0, maxPlatforms = 0;
       var i = 0, j = 0;
       while (i < numTrain && j < numTrain) {
         if (arr[i] < dep[j]) {
           platform_needed++;
           i++;
           if (platform_needed > maxPlatforms)
           maxPlatforms = platform_needed;
         }
         else {
           platform_needed--;
           j++;
         }
       }
      return maxPlatforms;
    },

    dropOnTrain(ev) {
      ev.preventDefault();
      var data = ev.dataTransfer.getData("text");
      var id = ev.currentTarget.id;
      var Trains = this.state.TRAINS;
      var Train = Trains[id-1];
      if (data === 'locomotive') {
        Train.locomotive = Train.locomotive + 1;
        if ( Train.locomotive > 1) {
          alert('Invalid train. There should be only one locomotive.')
        } else {
          alert(data + ' added suceessfully.')
        }
      } else {
        Train.carriage = Train.carriage + 1;
        this.setState({TRAINS: Trains});
        alert(data + ' added suceessfully.')
      }
    },

    addbuttonClicked() {
        var self=this;
        var locomotive = this.state.locomotive;
        var carriage = this.state.carriage;
        if (locomotive === 0 || locomotive > 1) {
          alert('Invalid train. There should be one locomotive. Please try again');
          this.setState({
            locomotive: 0,
            carriage: 0
          });
          return;
        } else if (carriage === 0) {
          alert('Invalid train. There should be one carriage.');
          return;
        }
        var TRAINS = this.state.TRAINS;
        var TRAIN = {
          locomotive: locomotive,
          carriage: carriage
        }
        TRAINS.push(TRAIN);
        this.setState({TRAINS: TRAINS});
        alert('Train added successfully');
        this.setState({
          locomotive: 0,
          carriage: 0
        });
    },

    allowDrop(ev) {
        ev.preventDefault();
    },

    drag(ev) {
      ev.dataTransfer.setData("text", ev.target.id);
    },

    drop(ev) {
      ev.preventDefault();
      var data = ev.dataTransfer.getData("text");
      var id = ev.currentTarget.id;
      if (data === 'locomotive') {
        var locomotive = this.state.locomotive + 1;
        if (locomotive > 1) {
          alert('Invalid train. There should be only one locomotive.')
        } else {
          this.setState({locomotive: locomotive});
          alert(data + ' added suceessfully. Please click add train button to add train to the list')
        }
      } else {
        var carriage = this.state.carriage + 1;
        this.setState({carriage: carriage});
        alert(data + ' added suceessfully. Please click add train button to add train to the list')
      }
    },

    render() {
      var self = this;
      var TrainList=this.state.TRAINS.map(function(result,key) {
          return (<Train id={key} data={result} ondropFunc={self.dropOnTrain} allowDropFunc={self.allowDrop}/>)
      });

      return (
          <div>
              <center>
                <p>Build Trains here</p>
                <div id="div1" style={outerContainerStyle}>
                  <div className="row" style={TrainListStyle}>
                      {TrainList}
                  </div>
                  <div style={dragDropAreaStyle} onDrop={this.drop} onDragOver={this.allowDrop}>
                    <p>Drag Drop Elements here to create train</p>
                  </div>
                </div>
              </center>
              <br></br>
              <center>
                <img id="locomotive" src="./locomotive.png" draggable="true" onDragStart={this.drag} width="60" height="60" style={{margin: '10px'}}></img>
                <img id="carriage" src="./carriage.png" draggable="true" onDragStart={this.drag} width="60" height="60" style={{margin: '10px'}}></img>
              </center>
              <div className="row">
                  <center>  <button onClick={this.addbuttonClicked}>Add train</button> <button onClick={this.calculateTrackClicked}>Calculate tracks</button> </center>
              </div>
          </div>
       );
    }
});


var Train_App = React.createClass({
    render(){
        return (<div><Navbar /> <TrainList /></div>)
    }
})


const routes = (
    <Route>
        <Route path="/" component={Train_App} />
    </Route>

)
render((
    <Router history={browserHistory}>
        {routes}
    </Router>
), document.getElementById('app'));

module.exports= Train_App;
