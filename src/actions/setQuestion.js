/**
 * Created by Dennis on 08/11/16.
 */

/*
 * action types
 */

export const ADD_QUESTION = 'ADD_QUESTION'
export const FETCH_QUESTION_FULLFILLED = 'FETCH_QUESTION_FULLFILLED'
export const FIRST_PAGE = 'FIRST_PAGE'

/*
 * other constants
 */

/*
 * action creators
 */

//export function addQuestion(text) {
//  return { type: ADD_QUESTION, text }
//}

export function fetchQuestion(){
  console.log("FETCH QUESTION FUNCTION FIRED")
  return {
    type: FETCH_QUESTION_FULLFILLED,
    text: "What is the capital of Canada",
  }
}

export function firstPage(){
  console.log("action first page")
  return {
    type: FIRST_PAGE,
    boolean: false,
  }
}

