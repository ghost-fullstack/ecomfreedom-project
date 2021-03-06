import { put, call, takeLatest } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import routes from 'constants/routes.json';
import {
  getCourses,
  createCourses,
  deleteCourses,
  getCourse,
  createSection,
  deleteSection,
  createLecture,
  deleteLecture,
  getPricingPlans,
  addPricingPlan,
  deletePricingPlan
} from 'utils/api/courses';
import {
  GET_COURSES_REQUEST,
  GET_COURSES_SUCCESS,
  GET_COURSES_FAILED,
  GET_COURSE_REQUEST,
  GET_COURSE_SUCCESS,
  GET_COURSE_FAILED,
  CREATE_COURSES_REQUEST,
  // CREATE_COURSES_SUCCESS,
  CREATE_COURSES_FAILED,
  DELETE_COURSES_REQUEST,
  DELETE_COURSES_SUCCESS,
  DELETE_COURSES_FAILED,
  CREATE_SECTIONS_REQUEST,
  CREATE_SECTIONS_SUCCESS,
  CREATE_SECTIONS_FAILED,
  DELETE_SECTIONS_REQUEST,
  DELETE_SECTIONS_SUCCESS,
  DELETE_SECTIONS_FAILED,
  CREATE_LECTURES_REQUEST,
  CREATE_LECTURES_SUCCESS,
  CREATE_LECTURES_FAILED,
  DELETE_LECTURES_REQUEST,
  DELETE_LECTURES_SUCCESS,
  DELETE_LECTURES_FAILED,
  GET_PRICING_PLANS_REQUEST,
  GET_PRICING_PLANS_SUCCESS,
  GET_PRICING_PLANS_FAILED,
  ADD_PRICING_PLAN_REQUEST,
  // ADD_PRICING_PLAN_SUCCESS,
  ADD_PRICING_PLAN_FAILED,
  DELETE_PRICING_PLAN_REQUEST,
  // DELETE_PRICING_PLAN_SUCCESS,
  DELETE_PRICING_PLAN_FAILED
} from 'constants/actionTypes';

// Responsible for searching media library, making calls to the API
// and instructing the redux-saga middle ware on the next line of action,
// for success or failure operation.
/* eslint-disable no-use-before-define */
export default function* watchCoursesListener() {
  yield takeLatest(GET_COURSES_REQUEST, getCoursesRequestSaga);
  yield takeLatest(GET_COURSE_REQUEST, getCourseRequestSaga);
  yield takeLatest(CREATE_COURSES_REQUEST, createCoursesRequestSaga);
  yield takeLatest(DELETE_COURSES_REQUEST, deleteCoursesRequestSaga);
  yield takeLatest(CREATE_SECTIONS_REQUEST, createSectionRequestSaga);
  yield takeLatest(DELETE_SECTIONS_REQUEST, deleteSectionRequestSaga);
  yield takeLatest(CREATE_LECTURES_REQUEST, createLectureRequestSaga);
  yield takeLatest(DELETE_LECTURES_REQUEST, deleteLectureRequestSaga);
  yield takeLatest(GET_PRICING_PLANS_REQUEST, getPricingPlansRequestSaga);
  yield takeLatest(ADD_PRICING_PLAN_REQUEST, createPricingPlanRequestSaga);
  yield takeLatest(DELETE_PRICING_PLAN_REQUEST, deletePricingPlanRequestSaga);
}

export function* getCoursesRequestSaga({ payload }) {
  try {
    const res = yield call(getCourses, payload);
    yield put({ type: GET_COURSES_SUCCESS, res });
  } catch (error) {
    yield put({ type: GET_COURSES_FAILED, error });
  }
}

export function* getCourseRequestSaga({ payload }) {
  try {
    const res = yield call(getCourse, payload);
    yield put({ type: GET_COURSE_SUCCESS, res });
  } catch (error) {
    yield put({ type: GET_COURSE_FAILED, error });
  }
}

export function* createCoursesRequestSaga({ payload }) {
  try {
    const res = yield call(createCourses, payload);
    // yield put({ type: CREATE_COURSES_SUCCESS, res });
    const id = res && res.data && res.data.id;

    if (id) {
      const payload = {
        title: 'First Section',
        courseId: id
      };
      const route = `${routes.ADMIN}${routes.CURRICULUM}`.replace(':course', id);

      yield call(createSectionRequestSaga, { payload });
      yield put(push(route));
    }
    // if (history && payload.redirect && id) {
    //   return payload.history.push(payload.redirect.replace(':course', id));
    // }
  } catch (error) {
    yield put({ type: CREATE_COURSES_FAILED, error });
  }
}

export function* deleteCoursesRequestSaga({ payload }) {
  try {
    const res = yield call(deleteCourses, payload);
    yield put({ type: DELETE_COURSES_SUCCESS, res: { ...res, name: payload.name } });
  } catch (error) {
    yield put({ type: DELETE_COURSES_FAILED, error });
  }
}

export function* createSectionRequestSaga({ payload }) {
  try {
    const res = yield call(createSection, payload);
    yield put({ type: CREATE_SECTIONS_SUCCESS, res });
    yield call(getCourseRequestSaga, { payload: { id: payload.courseId } });
  } catch (error) {
    yield put({ type: CREATE_SECTIONS_FAILED, error });
  }
}

export function* deleteSectionRequestSaga({ payload }) {
  try {
    const res = yield call(deleteSection, payload);
    yield put({ type: DELETE_SECTIONS_SUCCESS, res: { ...res, name: payload.name } });
  } catch (error) {
    yield put({ type: DELETE_SECTIONS_FAILED, error });
  }
}

export function* createLectureRequestSaga({ payload }) {
  try {
    const res = yield call(createLecture, payload);
    yield put({ type: CREATE_LECTURES_SUCCESS, res });
    yield call(getCourseRequestSaga, { payload: { id: payload.courseId } });
  } catch (error) {
    yield put({ type: CREATE_LECTURES_FAILED, error });
  }
}

export function* deleteLectureRequestSaga({ payload }) {
  try {
    const res = yield call(deleteLecture, payload);
    yield put({ type: DELETE_LECTURES_SUCCESS, res: { ...res, name: payload.name } });
  } catch (error) {
    yield put({ type: DELETE_LECTURES_FAILED, error });
  }
}

export function* getPricingPlansRequestSaga({ payload }) {
  try {
    const res = yield call(getPricingPlans, payload);
    yield put({ type: GET_PRICING_PLANS_SUCCESS, res });
  } catch (error) {
    yield put({ type: GET_PRICING_PLANS_FAILED, error });
  }
}

export function* createPricingPlanRequestSaga({ payload }) {
  try {
    yield call(addPricingPlan, payload);
    // yield put({ type: ADD_PRICING_PLAN_SUCCESS, res });
    yield call(getPricingPlansRequestSaga, { payload: { courseId: payload.courseId } });
  } catch (error) {
    yield put({ type: ADD_PRICING_PLAN_FAILED, error });
  }
}

export function* deletePricingPlanRequestSaga({ payload }) {
  try {
    yield call(deletePricingPlan, payload);
    // yield put({ type: DELETE_PRICING_PLAN_SUCCESS, res: { ...res, name: payload.name } });
    yield call(getCourseRequestSaga, { payload: { id: payload.courseId } });
  } catch (error) {
    yield put({ type: DELETE_PRICING_PLAN_FAILED, error });
  }
}
