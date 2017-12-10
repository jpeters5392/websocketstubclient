import React from 'react';

class JsonText extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isExpanded: false
        };

        this.toggleExpansion = this.toggleExpansion.bind(this);
    }

    toggleExpansion() {
        this.setState({
            isExpanded: !this.state.isExpanded
        });
    }

    render() {
        const expandableClassNames = this.state.isExpanded ? 'clickable expanded' : 'clickable collapsed';
        let jsonText = this.props.text;
        try {
            jsonText = JSON.parse(this.props.text);
        } catch(e) {
            // ignore this and treat the original text as a string only
        }

        if (!this.state.isExpanded && typeof jsonText !== 'string') {
            return (
                <span className={expandableClassNames} onClick={this.toggleExpansion}>
                    <span>{this.props.name}: {JSON.stringify(this.props.text)}</span>
                </span>
            );
        } else if (!this.state.isExpanded) {
            return (
                <span>
                    <span>{this.props.name}: {JSON.stringify(this.props.text)}</span>
                </span>
            );
        }

        if (Array.isArray(jsonText)) {
            return (
                <div>
                    <span className={expandableClassNames} onClick={this.toggleExpansion}>{this.props.name}: </span>
                    <ul>
                        {jsonText.map((item, index) => (
                            <li key={index}>
                                <JsonText name='[[Item]]' text={item} />
                            </li>
                        ))}
                    </ul>
                </div>
            );
        } else if (typeof jsonText === 'string') {
            return (
                <div>
                    <span className={expandableClassNames} onClick={this.toggleExpansion}>{this.props.name}: </span>
                    <span>{this.props.text}</span>
                </div>
            );
        } else {
            return (
                <div>
                    <span onClick={this.toggleExpansion}>{this.props.name}: </span>
                    <ul>
                        {Object.keys(jsonText).map(key => (
                            <li key={key}>
                                <JsonText name={key} text={jsonText[key]} />
                            </li>
                        ))}
                    </ul>
                </div>
            );
        }

        
    }
};

export default JsonText;