export const OSM_RELATION_REQUEST = 'OSM_RELATION_REQUEST';
export const OSM_RELATION_SUCCESS = 'OSM_RELATION_SUCCESS';
export const OSM_RELATION_FAILURE = 'OSM_RELATION_FAILURE';

export function osmRelation(index, relation){
  return function (dispatch) {
    dispatch({type: OSM_RELATION_REQUEST, relation: relation});
    var request = $.get("https://lz4.overpass-api.de/api/interpreter      id="+relation);
    request.success(function (data) {
      console.log("DATA "+data);
      dispatch({type: OSM_RELATION_SUCCESS, index: index, geoJson: data});
    });
    request.error(function(err){
      dispatch({type: OSM_RELATION_FAILURE, error: err});
    })
  }
}
