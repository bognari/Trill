/**
 * Created by Dennis on 20/06/17.
 */

import store from '../../stores/index';

export const ITEM_KNOWLEDGEBASE_REQUEST = 'ITEM_KNOWLEDGEBASE_REQUEST';
export const ITEM_KNOWLEDGEBASE_SUCCESS = 'ITEM_KNOWLEDGEBASE_SUCCESS';
export const ITEM_KNOWLEDGEBASE_FAILURE = 'ITEM_KNOWLEDGEBASE_FAILURE';

export default class ItemKnowledgeBase{

  constructor(k){
    this.k=k;
    this.information = {};
    this.information.kb = null;
    this.information.literal = null;
    this.information.label = null;
    this.information.image = null;
    this.information.uri = null;
    this.information.link_wikipedia = null;
    this.information.lat = null;
    this.information.long = null;

  }

  //returns result=="error message" if an error occurred and "" if everything went fine
  get(uri , callback){}

  startRequest(){
    return function (dispatch) {
      dispatch({
        type: ITEM_KNOWLEDGEBASE_REQUEST,
        index: this.k,
      })
      dispatch(this.fullRequest());
    }.bind(this)
  }

  fullRequest(){
    return function (dispatch){
      console.log("HERE before get");
      this.get(store.getState().qa.information[this.k], store.getState().lang.language, function callback(result){
        if (result=="error"){
          dispatch(this.error(result));
        } else {
          dispatch({
            type: ITEM_KNOWLEDGEBASE_SUCCESS,
            index: this.k,
            information: this.information
          })
        }
      }.bind(this))
    }.bind(this)
  }

  error(err){
    return function (dispatch){
      dispatch({
        type: ITEM_KNOWLEDGEBASE_FAILURE,
        index: this.k,
        error: err,
      })
    }.bind(this)
  }
}
