
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
					<div className="input-group">
						<input id="btn-input" type="text" className="form-control input-md" placeholder="run reference" onChange={this._handleChange.bind(this)} value={this.state.oref}/>
						<span className="input-group-btn">
							{ this.props.create_order && 
								<button className="btn btn-primary btn-md" disabled={(this.state.selected.length == 0)} id="btn-todo" onClick={this.props.create_order.bind(this, this.state.selected, this.state.oref)} >Create Order</button>
							}
						</span>
					</div>
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


export const Glass = ({cust, order_wait, order_done, order_inprog}) => { 
    return ( 

        <div className="row">
			<div className="col-xs-6 col-md-6 col-lg-6">
				<div className="panel panel-blue panel-widget ">
					<div className="row no-padding">
						<div className="col-sm-4 col-lg-5 widget-left">
							<svg xmlns="http://www.w3.org/2000/svg" className="glyph stroked bag">
                                <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#stroked-bag" /></svg>
						</div>
						<div className="col-sm-8 col-lg-7 widget-right">
							<div className="large">{order_wait}</div>
							<div className="text-muted">New Orders</div>
						</div>
					</div>
				</div>
			</div>
			<div className="col-xs-6 col-md-6 col-lg-6">
				<div className="panel panel-orange panel-widget">
					<div className="row no-padding">
						<div className="col-sm-4 col-lg-5 widget-left">
							<svg xmlns="http://www.w3.org/2000/svg" className="glyph stroked empty-message">
                            <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#stroked-empty-message" /></svg>
						</div>
						<div className="col-sm-8 col-lg-7 widget-right">
							<div className="large">{order_inprog}</div>
							<div className="text-muted">Orders in Progress</div>
						</div>
					</div>
				</div>
			</div>
			<div className="col-xs-6 col-md-6 col-lg-6">
				<div className="panel panel-teal panel-widget">
					<div className="row no-padding">
						<div className="col-sm-4 col-lg-5 widget-left">
							<svg xmlns="http://www.w3.org/2000/svg" className="glyph stroked male-user">
                            <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#stroked-male-user" /></svg>
						</div>
						<div className="col-sm-8 col-lg-7 widget-right">
							<div className="large">{cust}</div>
							<div className="text-muted">Customers</div>
						</div>
					</div>
				</div>
			</div>
			<div className="col-xs-6 col-md-6 col-lg-6">
				<div className="panel panel-red panel-widget">
					<div className="row no-padding">
						<div className="col-sm-4 col-lg-5 widget-left">
							<svg xmlns="http://www.w3.org/2000/svg" className="glyph stroked app-window-with-content">
                            <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#stroked-app-window-with-content" /></svg>
						</div>
						<div className="col-sm-8 col-lg-7 widget-right">
							<div className="large">{order_done}</div>
							<div className="text-muted">PDFs Generated</div>
						</div>
					</div>
				</div>
			</div>
		</div>
    );
}