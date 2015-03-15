(function() {
  var PureRenderMixin = React.addons.PureRenderMixin,
      classSet = React.addons.classSet;

  var Container = React.createClass({
    getInitialState: function() {
      this.handleRemoteData();

      return {
        data_arrived: false,
        data: {}
      }
    },

    handleRemoteData: function() {
      var self = this;

      this.getRemoteData().then(function(res) {
        setTimeout(function() {
          self.setState({
            data_arrived: true,
            data: res
          });
        }, 1000);
      },function(error) {
        console.warn(error.statusText);
      });
    },

    getRemoteData: function() {
      var path = '/local_mock_data.json';
      // var path = 'https://api.myjson.com/bins/10wgj';
      return $.ajax({ url: path });
    },

    render: function() {
      return (
        <Profile data_arrived={this.state.data_arrived} data={this.state.data} mutatable_class={this.state.mutatable_class}/>
      )
    }
  });

  var Profile = React.createClass({
    mixins: [PureRenderMixin],

    render: function() {
      var mutatable_class = classSet({
        'component waiting-on-data': !this.props.data_arrived,
        'component':                 this.props.data_arrived
      });

      var name, industry, full_name, profile_pic, staff_members = [];

      if(this.props.data_arrived) {
        name          = this.props.data.details.name;
        industry      = this.props.data.details.industry;
        full_name     = this.props.data.contact.person.first_name + ' ' + this.props.data.contact.person.last_name;
        profile_pic   = this.props.data.contact.person.picture;
        staff_members = this.props.data.staff;
      }

      return (
        <div className={mutatable_class}>
          <div className='title'>
            <h2>Company Details</h2>
            <button type="button" className="hidden-in-preview" onClick={this.submit}>Save</button>
          </div>
          <div className="component-inner">
            <div className='block'>
              <span className='block-left'>
                <strong>Name</strong>
              </span>
              <span className='block-right'>
                <p className='with-preview'>{name}</p>
              </span>
            </div>
            <div className='block'>
              <span className='block-left'>
                <strong>Industry</strong>
              </span>
              <span className='block-right'>
                <span>{industry}</span>
              </span>
            </div>
            <div className='block'>
              <span className='block-left'>
                <strong>Contact</strong>
                <input type="text" className="hidden-in-preview" />
              </span>
              <span className='block-right'>
                <Image src={profile_pic} width="73px" height="73px" />
                <h1 className='with-preview'>{full_name}</h1>
              </span>
            </div>
            <div className='block'>
              <span className='block-left'>
                <strong>Staff</strong>
              </span>
              <span className='block-right'>
                <ul>
                  {staff_members.map(function(member) {
                    return (
                      <li>
                        <Image src={member.picture} width="73px" height="73px" />
                        <span>{member.first_name}</span>
                        <span>{member.last_name}</span>
                      </li>
                    )
                  })}
                </ul>
              </span>
            </div>
          </div>
        </div>
      )
    },

    submit: function() {
      console.log('Click events only registered once data has arrived');
    }
  });

  var Image = React.createClass({
    mixins: [PureRenderMixin],

    render: function() {
      var image,
          image_dimensions = {
            width: this.props.width,
            height: this.props.height
          };

      if(this.props.src) {
        image = <img src={this.props.src} />
      }else {
        image = <div className='img-placeholder'></div>;
      }

      return (
        <div className='preact-image-mask' style={image_dimensions}>
          {image}
        </div>
      )
    },
  });

  React.render(
    <Container />,
    document.getElementById('app')
  );
})();
