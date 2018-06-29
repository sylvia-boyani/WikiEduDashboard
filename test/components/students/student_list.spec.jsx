import sinon from 'sinon';
import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import reducer from '../../../app/assets/javascripts/reducers';

import '../../testHelper';
import StudentList from '../../../app/assets/javascripts/components/students/student_list.jsx';
import ServerActions from '../../../app/assets/javascripts/actions/server_actions.js';

describe('StudentList', () => {
  const currentUser = { id: 1, admin: true, role: 1, isNonstudent: true };
  const users = [{
    role: 0,
    id: 3,
    username: "Adam",
    admin: false,
    course_training_progress: "0/3 training modules completed",
    real_name: null
  }];
  const params = { course_school: "Foobar", course_id: "asd" };
  const assignments = [{
    article_id: 7,
    article_title: "Foo",
    article_url: "https://en.wikipedia.org/wiki/Foo",
    assignment_id: 10,
    course_id: "Couse_school/Test_Course_(Couse_term)",
    id: 10,
    role: 1,
    user_id: 3,
    username: "Adam",
    admin: false
  }
  ];
  const course = {
    student_count: 1,
    trained_count: 0,
    published: true,
    home_wiki: { language: 'en', project: 'wikipedia' },
    account_requests_enabled: true
  };

  const initialState = { users: { users, sort: { sortKey: null, key: null } } };
  const reduxStoreWithUsers = createStore(reducer, initialState, compose(applyMiddleware(thunk)));

  it('displays \'Name\' column', () => {
    const studentList = ReactTestUtils.renderIntoDocument(
      <div>
        <StudentList
          store={reduxStoreWithUsers}
          params={params}
          students={users}
          course={course}
          course_id="Couse_school/Test_Course_(Couse_term)"
          editable={true}
          current_user ={currentUser}
          assignments={assignments}
        />
      </div>
    );
    expect(studentList.textContent).to.contain('Name');
  });

  it('triggers a server action when notify button is clicked', () => {
    global.Features = { wikiEd: true };
    global.confirm = function () { return true; };
    const notifyOverdue = sinon.spy(ServerActions, 'notifyOverdue');

    const studentList = ReactTestUtils.renderIntoDocument(
      <StudentList
        store={reduxStoreWithUsers}
        params={params}
        editable={true}
        students={users}
        course={course}
        course_id="Couse_school/Test_Course_(Couse_term)"
        current_user={currentUser}
        assignments={assignments}
      />
    );
    studentList.setState({ assignments: assignments });

    const button = ReactTestUtils.findRenderedDOMComponentWithClass(studentList, 'notify_overdue');
    ReactTestUtils.Simulate.click(button);
    expect(notifyOverdue.callCount).to.eq(1);

    ReactTestUtils.findRenderedDOMComponentWithClass(studentList, 'request_accounts');
  });
}
);
