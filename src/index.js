import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import expect from "expect";
import deepFreeze from "deep-freeze";
import { createStore, combineReducers } from "redux";

const todo = (state, action) => {
	switch (action.type) {
		case "ADD_TODO":
			return {
				id: action.id,
				text: action.text,
				completed: false
			};
		case "TOGGLE_TODO":
			if (state.id !== action.id) {
				return state;
			}
			return {
				...state,
				completed: !state.completed
			};
		default:
			return state;
	}
};

const todos = (state = [], action) => {
	switch (action.type) {
		case "ADD_TODO":
			return [...state, todo(undefined, action)];
		case "TOGGLE_TODO":
			return state.map(t => todo(t, action));
		default:
			return state;
	}
};

const visibilityFilter = (state = "SHOW_ALL", action) => {
	switch (action.type) {
		case "SET_VISIBILITY_FILTER":
			return action.filter;
		default:
			return state;
	}
};

// const todoApp = (state = {}, action) => {
//     return {
//         todos: todos(state.todos, action),
//         visibilityFilter: visibilityFilter(state.visibilityFilter, action)
//     }
// };

// const todoApp = combineReducers({
//     todos: todos,
//     visibilityFilter: visibilityFilter
// });

const todoApp = combineReducers({
	todos,
	visibilityFilter
});

const store = createStore(todoApp);
console.log(store.getState());

const testAddTodo = () => {
	const stateBefore = [];
	const action = {
		type: "ADD_TODO",
		id: 0,
		text: "Learn Redux"
	};
	const stateAfter = [
		{
			id: 0,
			text: "Learn Redux",
			completed: false
		}
	];

	deepFreeze(stateBefore);
	deepFreeze(action);

	expect(todos(stateBefore, action)).toEqual(stateAfter);
};

const testToggleTodo = () => {
	const stateBefore = [
		{
			id: 0,
			text: "Learn Redux",
			completed: false
		},
		{
			id: 1,
			text: "Go Shopping",
			completed: false
		}
	];
	const action = {
		type: "TOGGLE_TODO",
		id: 1
	};
	const stateAfter = [
		{
			id: 0,
			text: "Learn Redux",
			completed: false
		},
		{
			id: 1,
			text: "Go Shopping",
			completed: true
		}
	];

	deepFreeze(stateBefore);
	deepFreeze(action);

	expect(todos(stateBefore, action)).toEqual(stateAfter);
};

testAddTodo();
testToggleTodo();
console.log("All tests passed.");

let nextTodoId = 0;

class TodoApp extends React.Component {
	render() {
		return (
			<div>
                <input
                    ref={node => {
                        this.input = node;
                    }}
                />
				<button
					onClick={() => {
						store.dispatch({
							type: "ADD_TODO",
							text: this.input.value,
							id: nextTodoId++
                        });
                        this.input.value = '';
					}}
				>
					Add Todo
				</button>
				<ul>
					{this.props.todos.map(todo => {
						return <li key={todo.id}
                        onClick={() => {
                            store.dispatch({
                                type: 'TOGGLE_TODO',
                                id: todo.id
                            })
                        }}
                        style={{
                            textDecoration: todo.completed ? 'line-through' : 'none'
                        }}
                        >{todo.text}</li>;
					})}
				</ul>
			</div>
		);
	}
}

const render = () => {
	ReactDOM.render(<TodoApp todos={store.getState().todos} />, document.getElementById("root"));
};

store.subscribe(render);
render();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
