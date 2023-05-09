import React, { Component } from 'react';
import FormsThemeFactory from '../formThemes/formThemeFactory';

class SelectComponent extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.wrapperRef = React.createRef();
        this.setWrapperRef = this.setWrapperRef;
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.state = {
           
        };
    }
    handleChange(e) {

        
        let { name, value } = e.target;
        
        this.setState({ value: value });
        this.props.handleChange(e);
    }

    componentDidMount() {
        debugger
        if(this.props.defaultValue){
            let name = this.props.name;
            let value = this.props.defaultValue;
            this.props.handleChangeWithoutEvent({name:name, value:value})
            
        }
        document.addEventListener('mousedown', this.handleClickOutside);
    }
    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }
    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
            if (this.props.emitClickedOutside !== undefined)
            {
                this.props.emitClickedOutside(this.state);
            }
        }
    }
    render() {
        let theme= undefined;
        if(this.props.theme){
            theme = FormsThemeFactory.getFormsThemeFactory()[this.props.theme]
        }
        let inputType = {
            required: <select 
            className={this.props.class ? this.props.class : "form-control"}
            onChange={this.handleChange}
            name={this.props.name}
            size={this.props.size}
            style={this.props.inputStyle?this.props.inputStyle:theme!==undefined?theme.selectStyle:undefined}
            id={this.props.id}
            onClick={this.props.onClick}
                required
               
            >
                 {this.props.selectOptions.map((option, index)=>
                <option value={option}>{option}</option>
                )}
            </select>,
            normal: <select 
            className={this.props.class ? this.props.class : "form-control"}
            onChange={this.handleChange}
            name={this.props.name}
            size={this.props.size}
            style={this.props.inputStyle?this.props.inputStyle:theme!==undefined?theme.selectStyle:undefined}
            id={this.props.id}
            onClick={this.props.onClick}
            // inputStyle={this.props.inputStyle}

            >
                {this.props.defaultValue &&(<option value={this.props.defaultValue}>{this.props.defaultValue}</option>)}
                {this.props.selectOptions.map((option, index)=>
                <option value={option}>{this.props.textOptions? this.props.textOptions[index] :option}</option>
                )}
            </select>,
            disabled: <select 
            className={this.props.class ? this.props.class : "form-control"}
            name={this.props.name}
            style={this.props.inputStyle?this.props.inputStyle:theme!==undefined?theme.selectStyle:undefined}
            id={this.props.id}
            onClick={this.props.onClick}
                disabled
            >
                 {this.props.selectOptions.map((option, index)=>
                <option value={option}>{option}</option>
                )}
            </select>,
            optGropu: <></>,
            multiple: <></>,
            form: <></>,
            autofocus: <></>
        }




        return (
            <div ref={this.wrapperRef} style={this.props.wrapperStyle?this.props.wrapperStyle:theme!==undefined?theme.selectWrapperStyle:undefined} className={this.props.wrapperClass}>
                {this.props.label && (<label style={this.props.labelStyle?this.props.labelStyle:theme!==undefined?theme.selectLabelStyle:undefined} className={this.props.labelClass}>{this.props.label}</label>)}
                {inputType[this.props.input]}
                <div className="componentErrorMessage" >{this.props.errorMessage}</div>
            </div>
        );
    }
}



export default SelectComponent;