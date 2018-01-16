import iri from "iri";

export const WIKIPEDIA_REQUEST = 'WIKIPEDIA_REQUEST';
export const WIKIPEDIA_SUCCESS = 'WIKIPEDIA_SUCCESS';
export const WIKIPEDIA_FAILURE = 'WIKIPEDIA_FAILURE';

export function wikipedia(index, wikipedia, lang){
  return function (dispatch) {
    dispatch({type: WIKIPEDIA_REQUEST, url: wikipedia});
    var url = "https://"+lang+".wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&origin=*&explaintext=&titles=" + iri.toIRIString(wikipedia.replace("https://"+lang+".wikipedia.org/wiki/","")).replace("%20","_");
    var request = $.get(url)
    request.success(function (data) {
      for(var key in data.query.pages){
        if(data.query.pages.hasOwnProperty(key)){
          if (data.query.pages[key].extract !=undefined){
            var abstract = data.query.pages[key].extract ;
            dispatch({type: WIKIPEDIA_SUCCESS, index: index, abstract: abstract});
          }
        }
      }
    }.bind(this))
    request.error(function(err){
      dispatch({type: WIKIPEDIA_FAILURE, error: err});
    })
  }
}
