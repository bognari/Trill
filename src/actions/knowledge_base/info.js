/**
 * Created by Dennis on 20/06/17.
 */

import store from '../../stores/index';
import ItemDbpedia from "./implemented/dbpedia"
import ItemWikidata from "./implemented/wikidata"
import ItemMusicBrainz from "./implemented/musicbrainz"
import ItemDblp from "./implemented/dblp"
import ItemBiennale from "./implemented/biennale"
import ItemFreebase from "./implemented/freebase"
import ItemScigraph from "./implemented/scigraph"
import ItemOpenStreetMap from "./implemented/openstreetmap";

export function info(index){
  return function (dispatch) {
    console.log("INFO");
    console.log(store.getState().qa.information[index].kb);
    switch (store.getState().qa.information[index].kb) {
      case "wikidata": {
        var itemWikidata = new ItemWikidata(index);
        dispatch(itemWikidata.startRequest());
        break;
      }
      case "dbpedia": {
        var itemDbpedia = new ItemDbpedia(index);
        dispatch(itemDbpedia.startRequest());
        break;
      }
      case "musicbrainz": {
        var itemMusicBrainz = new ItemMusicBrainz(index);
        dispatch(itemMusicBrainz.startRequest());
        break;
      }
      case "dblp": {
        var itemDblp = new ItemDblp(index);
        dispatch(itemDblp.startRequest());
        break;
      }
      case "biennale": {
        var itemBiennale = new ItemBiennale(index);
        dispatch(itemBiennale.startRequest());
        break;
      }
      case "freebase": {
        var itemFreebase = new ItemFreebase(index);
        dispatch(itemFreebase.startRequest());
        break;
      }
      case "scigraph": {
        var itemScigraph = new ItemScigraph(index);
        dispatch(itemScigraph.startRequest());
        break;
      }
      case "openstreetmap": {
        var itemOpenstreetmap = new ItemOpenStreetMap(index);
        dispatch(itemOpenstreetmap.startRequest());
        break;
      }
      console.log("ERROR The following knowledgebase is not supported:",store.getState().qa.information[index].kb);

    }
  }
}
