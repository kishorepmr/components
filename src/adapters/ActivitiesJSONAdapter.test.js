import {isObservable} from 'rxjs';
import {last} from 'rxjs/operators';
import activities from '../data/activities';
import ActivitiesJSONAdapter from './ActivitiesJSONAdapter';

describe('Activities JSON Adapter', () => {
  const activityID = 'activity9';
  const activityWithoutCardsID = 'activity8';
  let activitiesJSONAdapter;
  let mockActivitiesString;
  let mockActivitiesCopy;
  let testActivity;
  let activityWithoutCards;

  beforeEach(() => {
    mockActivitiesString = JSON.stringify(activities);
    mockActivitiesCopy = JSON.parse(mockActivitiesString);

    activitiesJSONAdapter = new ActivitiesJSONAdapter(mockActivitiesCopy);
    testActivity = mockActivitiesCopy[activityID];
    activityWithoutCards = mockActivitiesCopy[activityWithoutCardsID];
  });

  afterEach(() => {
    activitiesJSONAdapter = null;
    testActivity = null;
    activityWithoutCards = null;
  });

  describe('getActivity()', () => {
    test('returns an observable', () => {
      expect(isObservable(activitiesJSONAdapter.getActivity())).toBeTruthy();
    });

    test('emits an Activity object on subscription', (done) => {
      activitiesJSONAdapter.getActivity(activityID).subscribe((data) => {
        expect(data).toEqual(testActivity);
        done();
      });
    });

    test('throws a proper error message when activity doesn\'t exist', (done) => {
      const wrongActivityID = 'wrongActivityID';

      activitiesJSONAdapter.getActivity(wrongActivityID).subscribe(
        () => {
          done.fail('Emits activity instead of returning error');
        },
        (error) => {
          expect(error.message).toBe(`Could not find activity with ID "${wrongActivityID}"`);
          done();
        },
      );
    });

    test('completes the observable', (done) => {
      activitiesJSONAdapter.getActivity(activityID).subscribe(
        () => {},
        () => {},
        () => {
          expect(true).toBeTruthy();
          done();
        },
      );
    });
  });

  describe('postAction()', () => {
    const inputs = {
      firstName: 'Simon',
      lastName: 'Damiano',
    };

    test('returns an observable', () => {
      expect(isObservable(activitiesJSONAdapter.postAction())).toBeTruthy();
    });

    test('emits the posted action object', (done) => {
      activitiesJSONAdapter.postAction(activityID, inputs).pipe(last()).subscribe((action) => {
        expect(action).toMatchObject(testActivity.actions.slice(-1)[0]);
        done();
      });
    });

    test('emits an error on invalid activity ID', (done) => {
      activitiesJSONAdapter.postAction('activity10', {}).subscribe(
        () => {},
        (error) => {
          expect(error.message).toBe('Unable to create an attachment action for activity with id "activity10"');
          done();
        },
      );
    });
  });

  describe('postActivity()', () => {
    const activityData = {
      roomID: 'roomID',
      text: 'text',
      cards: [{
        $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
        type: 'AdaptiveCard',
        version: '1.2',
        body: [
          {
            type: 'TextBlock',
            text: 'Adaptive Cards',
            size: 'large',
          },
        ],
        attachments: [],
        actions: [
          {
            type: 'Action.OpenUrl',
            url: 'http://adaptivecards.io',
            title: 'Learn More',
          },
        ],
      }],
      displayHeader: true,
    };

    test('returns an observable', () => {
      expect(isObservable(activitiesJSONAdapter.postActivity())).toBeTruthy();
    });

    test('emits the posted Activity object', (done) => {
      activitiesJSONAdapter.postActivity(activityData).pipe(last()).subscribe((activity) => {
        expect(activity).toMatchObject(mockActivitiesCopy[
          Object.keys(mockActivitiesCopy).slice(-1)[0]
        ]);
        done();
      });
    });

    test('emits an error on invalid room id', (done) => {
      activitiesJSONAdapter.postActivity({roomID: undefined}).subscribe(
        () => {},
        (error) => {
          expect(error.message).toBe('Unable to post an activity in room with id undefined');
          done();
        },
      );
    });
  });

  describe('hasAdaptiveCards()', () => {
    test('returns true if activity object has at least one adaptive card', () => {
      const hasCards = activitiesJSONAdapter.hasAdaptiveCards(testActivity);

      expect(hasCards).toBeTruthy();
    });

    test('returns false if activity object doesn\'t have at least one adaptive card', () => {
      const hasCards = activitiesJSONAdapter.hasAdaptiveCards(activityWithoutCards);

      expect(hasCards).toBeFalsy();
    });
  });

  describe('getAdaptiveCard()', () => {
    test('returns the first card object if the activity object has at least one adaptive card', () => {
      const card = activitiesJSONAdapter.getAdaptiveCard(testActivity, 0);

      expect(card).toMatchObject({
        $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
        type: 'AdaptiveCard',
        version: '1.2',
        body: [
          {
            type: 'TextBlock',
            text: 'Hotel Booking',
            size: 'large',
          },
          {
            type: 'Container',
            separator: true,
            spacing: 'medium',
            items: [
              {
                type: 'ColumnSet',
                separator: true,
                columns: [
                  {
                    type: 'Column',
                    width: 1,
                    items: [
                      {
                        type: 'Input.Text',
                        id: 'firstName',
                        style: 'text',
                        height: 'auto',
                        isRequired: true,
                        errorMessage: 'First Name is required',
                        label: 'First Name',
                      },
                    ],
                  },
                  {
                    type: 'Column',
                    width: 1,
                    items: [
                      {
                        type: 'Input.Text',
                        id: 'lastName',
                        style: 'text',
                        height: 'auto',
                        isRequired: true,
                        errorMessage: 'Last Name is required',
                        label: 'Last Name',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'Input.Text',
                id: 'myEmail',
                style: 'email',
                height: 'auto',
                isRequired: true,
                errorMessage: 'Email is required',
                label: 'Email',
              },
            ],
          },
          {
            type: 'Input.ChoiceSet',
            id: 'roomType',
            style: 'compact',
            isMultiSelect: false,
            label: 'Room type',
            isRequired: true,
            errorMessage: 'Required input',
            placeholder: 'Please select the room type',
            choices: [
              {
                title: 'Standard Room (1 to 2 People)',
                value: '1',
              },
              {
                title: 'Family Room (1 to 4 Peole)',
                value: '2',
              },
              {
                title: 'Private Room (1 to 3 Peole)',
                value: '3',
              },
            ],
          },
          {
            type: 'Input.Number',
            id: 'numberOfGuests',
            placeholder: 'Please select the number of guests',
            label: 'Number of Guests',
            isRequired: true,
            min: 1,
            max: 10,
            value: 0,
          },
          {
            type: 'ColumnSet',
            columns: [
              {
                type: 'Column',
                width: 1,
                items: [
                  {
                    type: 'Input.Date',
                    id: 'arrivalDate',
                    height: 'auto',
                    isRequired: true,
                    errorMessage: 'Arrival Date is required',
                    label: 'Arrival Date',
                  },
                ],
              },
              {
                type: 'Column',
                width: 1,
                items: [
                  {
                    type: 'Input.Time',
                    id: 'arrivalTime',
                    label: 'Arrival Time',
                    isRequired: true,
                    min: '10:00',
                    max: '23:59',
                    value: '10:00',
                  },
                ],
              },
            ],
          },
          {
            type: 'Input.Date',
            id: 'departureDate',
            height: 'auto',
            isRequired: true,
            errorMessage: 'This is a required input',
            label: 'Departure Date',
          },
          {
            type: 'Input.ChoiceSet',
            id: 'pickUp',
            style: 'expanded',
            spacing: 'medium',
            isMultiSelect: false,
            label: 'Free pickup?',
            isRequired: true,
            errorMessage: 'Pick up option on arrival',
            choices: [
              {
                title: 'Yes Please! - Pick me up on arrival',
                value: '1',
              },
              {
                title: 'No Thanks - I will make my own way there',
                value: '2',
              },
            ],
          },
        ],
        actions: [
          {
            type: 'Action.Submit',
            title: 'Submit',
          },
        ],
      });
    });

    test('returns undefined if Activity object doesn\'t have at least one adaptive card', () => {
      const card = activitiesJSONAdapter.getAdaptiveCard(activityWithoutCards);

      expect(card).toBeUndefined();
    });
  });
});
