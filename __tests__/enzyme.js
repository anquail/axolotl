import React from 'react';
import { configure, shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
// import TestRenderer from 'react-test-renderer';
import Home from '../client/pages/Home'
import Login from '../client/pages/login'
// Newer Enzyme versions require an adapter to a particular version of React
configure({ adapter: new Adapter() });
describe("React unit tests", () => {
    describe('Home', () => {
        let wrapper;
        const props = {
            user: { key: 'value' },
            interests: [],
            interestIdx: 0,
            loggingIn: false
        };
        beforeAll(() => {
            wrapper = shallow(<Home {...props} />);
            // const testRenderer = TestRenderer.create(<Home />);
            // const testInstance = testRenderer.root;
        });
        // it('prop loggingIn exists and is false', () => {
        //     expect(testInstance.findByType(SubComponent).props.loggingIn).toBe(false);
        // });
        xit('prop loggingIn is false', () => {
            console.log(wrapper.debug());
            expect(wrapper.prop('loggingIn')).toBe(false)
        });
        it('says loading if user is not defined', () => {
            console.log(wrapper);
            // expect(wrapper.props.user).toEqual({});
            expect(wrapper.find('h1').text()).toEqual('OUT OF MATCHES');
        });
    });
    describe("Login", () => {
        let wrapper;
        beforeAll(() => {
            wrapper = shallow(<Login/>);
        });
        it('has div called main container', () => {
            expect(wrapper.type()).toEqual('div');
            expect(wrapper.find('h2').text()).toEqual('Welcome');
        })
    })
    // if obj keys IS defined & more matches available, need to
    //return a div with class name "mainContainer", and contains a usercard
});