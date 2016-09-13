
'use strict;' 
import React, {Component} from 'react'; 
import update from 'react-addons-update';


export class ToDoList extends Component {

	constructor (props) {
		super(props);
		this.state = {oref: "", selected: []}
	}

	_selectfn(id) {
		let existing_idx = this.state.selected.indexOf(id);
		if (existing_idx == -1) {
			this.setState({selected: update(this.state.selected, { $push: [id]})});
		} else {
			this.setState({selected: update(this.state.selected, { $splice: [[existing_idx,1]]})});
		}
	}

	_handleChange (e) {
      this.setState({oref: e.target.value})
    }

	_buttonPress() {
		this.props.buttonfn(this.state.selected, this.state.oref)
		this.setState({selected: [], oref: ""})
	}


	render () {
		return (
			<div className="panel panel-blue">
				<div className="panel-heading dark-overlay"><svg className="glyph stroked clipboard-with-paper">
					<use xlinkHref="#stroked-clipboard-with-paper"></use></svg>{this.props.title}
				</div>
				{ this.props.conns && this.props.conns.length >0 && 
				<div className="panel-body">
					<ul className="todo-list">
						{ this.props.conns.map ((k) => {
							return <ToDoListItem key={k.id} item={k} columns={this.props.columns} checked={(this.state.selected.indexOf(k.id)>=0)} selectfn={this._selectfn.bind(this)}/>
						})}
					</ul>
				</div>
				}
				<div className="panel-footer">
					{ this.props.buttonfn && 
					<div className="input-group">
						<input id="btn-input" type="text" className="form-control input-md" placeholder="run reference" onChange={this._handleChange.bind(this)} value={this.state.oref}/>
						<span className="input-group-btn">
								<button className="btn btn-primary btn-md" disabled={(this.state.selected.length == 0)} id="btn-todo" onClick={this._buttonPress.bind(this)} >{this.props.buttontxt}</button>
						</span>
					</div>
					}
				</div>
			</div>
		)
	}
}

const ToDoListItem = ({item, columns, selectfn, checked}) => {
    return (
        <li className="todo-list-item">
            <div className="checkbox">
                <input type="checkbox" id="checkbox" defaultChecked={checked} onClick={selectfn.bind(this, item.id, checked)}/>
				{ columns.map((c, i) => {
					return <label key={i}>{item[c]}</label>
				})}
            </div>
            <div className="pull-right action-buttons">
                <a href="#"><svg className="glyph stroked pencil">
                <use xlinkHref="#stroked-pencil"></use></svg></a>
                <a href="#" className="flag"><svg className="glyph stroked flag"><use xlinkHref="#stroked-flag"></use></svg></a>
                <a href="#" className="trash"><svg className="glyph stroked trash"><use xlinkHref="#stroked-trash"></use></svg></a>
            </div>
        </li>
    )
}

export const Glass = ({icon, title, qty, color}) => { 
    return ( 

			<div className="col-xs-6 col-md-6 col-lg-6">
				<div className={`panel panel-${color} panel-widget`}>
					<div className="row no-padding">
						<div className="col-sm-4 col-lg-5 widget-left">
							<svg xmlns="http://www.w3.org/2000/svg" className={`glyph stroked ${icon}`}>
                                <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref={`#stroked-${icon}`} /></svg>
						</div>
						<div className="col-sm-8 col-lg-7 widget-right">
							<div className="large">{qty}</div>
							<div className="text-muted">{title}</div>
						</div>
					</div>
				</div>
			</div>
    );
}