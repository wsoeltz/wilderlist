/* eslint-disable max-len */
/* tslint:disable:max-line-length */
import React from 'react';

const TrailScripts = () => {
  return (
    <pre style={{whiteSpace: 'pre'}}
      dangerouslySetInnerHTML={{__html: `
const fs &equals; require&lpar;&lsquo;fs&lsquo;&rpar;;
const query_overpass &equals; require&lpar;&lsquo;query-overpass&lsquo;&rpar;;
async function asyncForEach&lpar;array, callback&rpar; &lcub;
  for &lpar;let index &equals; 0; index &lt; array.length&semi; index++&rpar; &lcub;
    try &lcub;
      await callback&lpar;array[index], index, array&rpar;;
    &rcub; catch &lpar;err&rpar; &lcub;
      console.error&lpar;err&rpar;;
    &rcub;
  &rcub;
&rcub;
const northernmost &equals;   50
const southernmost &equals;   24
const easternmost  &equals;  -66
const westernmost  &equals; -125
const maxCalls &equals; 1708;
const throttle &equals; 50000;
const progress_file_name &equals; &lsquo;./output/raw/progress.json&lsquo;;
let tileProgressIds;
try &lcub;
  tileProgressIds &equals; JSON.parse&lpar;fs.readFileSync&lpar;progress_file_name&rpar;&rpar;;
&rcub; catch &lpar;err&rpar; &lcub;
  tileProgressIds &equals; [];
&rcub;
let totalCalls &equals; 0;
let lat &equals; northernmost;
let lng &equals; westernmost;
function fetchData&lpar;&rpar; &lcub;
  const minLat &equals; lat - 1;
  const maxLat &equals; lat;
  const minLng &equals; lng;
  const maxLng &equals; lng + 1;
  const tileId &equals; &grave;&dollar;&lcub;minLat&rcub;,&dollar;&lcub;minLng&rcub;,&dollar;&lcub;maxLat&rcub;,&dollar;&lcub;maxLng&rcub;&grave;;
  if &lpar;tileProgressIds.includes&lpar;tileId&rpar;&rpar; &lcub;
    totalCalls++;
    lng &equals; lng + 1;
    let atEastCoast &equals; false;
    if &lpar;lng &gt; easternmost + 1&rpar; &lcub;
      atEastCoast &equals; true;
      lng &equals; westernmost;
      lat &equals; lat - 1;
    &rcub;
    if &lpar;!&lpar;lat &lt; southernmost - 1 &amp;&amp; atEastCoast&rpar;&rpar; &lcub;
      fetchData&lpar;&rpar;;
    &rcub;
  &rcub; else &lcub;
    query_overpass&lpar;&grave;
      [bbox:&dollar;&lcub;minLat&rcub;,&dollar;&lcub;minLng&rcub;,&dollar;&lcub;maxLat&rcub;,&dollar;&lcub;maxLng&rcub;];
      &lpar;
        relation[route&equals;hiking];
        way[highway&equals;path];
        way[highway&equals;track];
        way[highway&equals;footway];
        way[highway&equals;steps];
        way[highway&equals;bridleway];
        way[highway&equals;cycleway];
      &rpar;;

      out body;
      &gt;;
      out skel qt;
      &grave;, &lpar;error, data&rpar; &equals;&gt; &lcub;
        if &lpar;error&rpar; &lcub;
        &rcub; else if &lpar;data&rpar; &lcub;
          const filename &equals; &grave;./output/raw/tile__&dollar;&lcub;lat&rcub;-&dollar;&lcub;Math.abs&lpar;lng&rpar;&rcub;.json&grave;;
          fs.writeFileSync&lpar;filename, JSON.stringify&lpar;data&rpar;&rpar;;
          tileProgressIds.push&lpar;tileId&rpar;;
          fs.writeFileSync&lpar;progress_file_name, JSON.stringify&lpar;tileProgressIds&rpar;&rpar;;
          totalCalls++;
          lng &equals; lng + 1;
          let atEastCoast &equals; false;
          if &lpar;lng &gt; easternmost + 1&rpar; &lcub;
            atEastCoast &equals; true;
            lng &equals; westernmost;
            lat &equals; lat - 1;
          &rcub;
        &rcub;
      &rcub;&rpar;
  &rcub;
&rcub;


const fs &equals; require&lpar;&lsquo;fs&lsquo;&rpar;;
const inside &equals; require&lpar;&lsquo;point-in-geopolygon&lsquo;&rpar;;
const input_folder &equals; &lsquo;&period;&sol;output&sol;raw&sol;&lsquo;;
const output_folder &equals; &lsquo;&period;&sol;output&sol;clean&sol;&lsquo;;
const included_ids &equals; &lsquo;&period;&sol;output&sol;clean&sol;included_ids&period;json&lsquo;;
const progress_file_name &equals; &lsquo;&period;&sol;output&sol;clean&sol;progress&period;json&lsquo;;
let tileProgressIds;
try &lcub;
  tileProgressIds &equals; JSON&period;parse&lpar;fs&period;readFileSync&lpar;progress_file_name&rpar;&rpar;;
&rcub; catch &lpar;err&rpar; &lcub;
  tileProgressIds &equals; &lsqb;&bsol;;
&rcub;
let featureProgressIds;
try &lcub;
  featureProgressIds &equals; JSON&period;parse&lpar;fs&period;readFileSync&lpar;included_ids&rpar;&rpar;;
&rcub; catch &lpar;err&rpar; &lcub;
  featureProgressIds &equals; &lsqb;&bsol;;
&rcub;
const usa_geojson &equals; JSON&period;parse&lpar;fs&period;readFileSync&lpar;&lsquo;&period;&sol;assets&sol;us_geojson_census_bureau&period;json&lsquo;&rpar;&rpar;;
const other_countries_geojson &equals; JSON&period;parse&lpar;fs&period;readFileSync&lpar;&lsquo;&period;&sol;assets&sol;other_countries&period;json&lsquo;&rpar;&rpar;;
const files &equals; fs&period;readdirSync&lpar;input_folder&rpar;;
files&period;forEach&lpar;&lpar;file, i&rpar; &equals;> &lcub;
  const tileId &equals; file&period;replace&lpar;&lsquo;&period;json&lsquo;, &lsquo;&lsquo;&rpar;;
  if &lpar;tileProgressIds&period;includes&lpar;tileId&rpar;&rpar; &lcub;
  &rcub; else &lcub;

      const data &equals; JSON&period;parse&lpar;fs&period;readFileSync&lpar;input_folder + file&rpar;&rpar;;
      if &lpar;data&period;type&rpar; &lcub;
        const cleaned_features &equals; &lsqb;&bsol;;
        data&period;features&period;forEach&lpar;feature &equals;> &lcub;
          const &lcub;id, properties, geometry&rcub; &equals; feature;
          let osmId;
          if &lpar;properties&period;id&rpar; &lcub;
            osmId &equals; properties&period;id;
          &rcub; else if &lpar;feature&period;id&rpar; &lcub;
            osmId &equals; feature&period;id;
          &rcub;
          if &lpar;osmId &amp;&amp; &excl;featureProgressIds&period;includes&lpar;osmId&rpar; &amp;&amp; geometry&period;type &excl;&equals;&equals; &lsquo;Point&lsquo;&rpar; &lcub;

            const tags &equals; properties&period;tags
            let sidewalk &equals;
              &lpar;tags&period;footway &amp;&amp; &lpar;tags&period;footway &equals;&equals;&equals; &lsquo;sidewalk&lsquo; &verbar;&verbar; tags&period;footway &equals;&equals;&equals; &lsquo;crossing&lsquo;&rpar;&rpar; &verbar;&verbar;
              &lpar;tags&period;sidewalk &amp;&amp; &lpar;&excl;tags&period;sidewalk &equals;&equals;&equals; &lsquo;no&lsquo; &verbar;&verbar; &excl;tags&period;sidewalk &equals;&equals;&equals; &lsquo;none&lsquo;&rpar;&rpar;

            let name;
            if &lpar;tags&period;name&rpar; &lcub;
              name &equals; tags&period;name;
            &rcub; else if &lpar;tags&lsqb;&lsquo;tiger:name_&lsquo;&bsol;&rpar; &lcub;
              name &equals; tags&lsqb;&lsquo;tiger:name_&lsquo;&bsol;;
            &rcub;  else if &lpar;tags&lsqb;&lsquo;tiger:name_full&lsquo;&bsol;&rpar; &lcub;
              name &equals; tags&lsqb;&lsquo;tiger:name_full&lsquo;&bsol;;
            &rcub; else if &lpar;tags&period;orig_name&rpar; &lcub;
              name &equals; tags&period;orig_name;
            &rcub; else if &lpar;tags&lsqb;&lsquo;name:en&lsquo;&bsol;&rpar; &lcub;
              name &equals; tags&lsqb;&lsquo;name:en&lsquo;&bsol;;
            &rcub; else if &lpar;tags&period;name1&rpar; &lcub;
              name &equals; tags&period;name1;
            &rcub; else if &lpar;tags&period;name2&rpar; &lcub;
              name &equals; tags&period;name2;
            &rcub; else if &lpar;tags&period;nickname&rpar; &lcub;
              name &equals; tags&period;nickname;
            &rcub; else if &lpar;tags&lsqb;&lsquo;piste:name&lsquo;&bsol;&rpar; &lcub;
              name &equals; tags&lsqb;&lsquo;piste:name&lsquo;&bsol;;
            &rcub; else if &lpar;tags&period;reg_name&rpar; &lcub;
              name &equals; tags&period;reg_name;
            &rcub; else if &lpar;tags&period;short_name&rpar; &lcub;
              name &equals; tags&period;short_name;
            &rcub; else if &lpar;tags&lsqb;&lsquo;was:name&lsquo;&bsol;&rpar; &lcub;
              name &equals; tags&lsqb;&lsquo;was:name&lsquo;&bsol;;
            &rcub; else if &lpar;tags&period;old_name&rpar; &lcub;
              name &equals; tags&period;old_name;
            &rcub; else if &lpar;tags&period;official_name&rpar; &lcub;
              name &equals; tags&period;official_name;
            &rcub; else if &lpar;tags&lsqb;&lsquo;planned:name&lsquo;&bsol;&rpar; &lcub;
              name &equals; tags&lsqb;&lsquo;planned:name&lsquo;&bsol;;
            &rcub; else if &lpar;tags&lsqb;&lsquo;proposed:name&lsquo;&bsol;&rpar; &lcub;
              name &equals; tags&lsqb;&lsquo;proposed:name&lsquo;&bsol;;
            &rcub; else &lcub;
              name &equals; null;
            &rcub;

            let type;
            let allowsBikes &equals; null;
            let allowsHorses &equals; null;
            let skiTrail &equals; null;

            if &lpar;tags&period;sac_scale&rpar; &lcub;
              if &lpar;tags&period;sac_scale &equals;&equals;&equals; &lsquo;hiking&lsquo;&rpar; &lcub;
                type &equals; &lsquo;hiking&lsquo;;
              &rcub; else if &lpar;tags&period;sac_scale &equals;&equals;&equals; &lsquo;mountain_hiking&lsquo;&rpar; &lcub;
                type &equals; &lsquo;mountain_hiking&lsquo;;
              &rcub; else if &lpar;tags&period;sac_scale &equals;&equals;&equals; &lsquo;demanding_mountain_hiking&lsquo;&rpar; &lcub;
                type &equals; &lsquo;demanding_mountain_hiking&lsquo;;
              &rcub; else if &lpar;tags&period;sac_scale &equals;&equals;&equals; &lsquo;alpine_hiking&lsquo;&rpar; &lcub;
                type &equals; &lsquo;alpine_hiking&lsquo;;
              &rcub; else if &lpar;tags&period;sac_scale &equals;&equals;&equals; &lsquo;demanding_alpine_hiking&lsquo;&rpar; &lcub;
                type &equals; &lsquo;demanding_alpine_hiking&lsquo;;
              &rcub; else if &lpar;tags&period;sac_scale &equals;&equals;&equals; &lsquo;difficult_alpine_hiking&lsquo;&rpar; &lcub;
                type &equals; &lsquo;difficult_alpine_hiking&lsquo;;
              &rcub; else &lcub;
                type &equals; &lsquo;hiking&lsquo;;
              &rcub;
            &rcub; else if &lpar;tags&period;trail_visibility&rpar; &lcub;
              if &lpar;tags&period;trail_visibility &equals;&equals;&equals; &lsquo;excellent&lsquo; &verbar;&verbar;
                  tags&period;trail_visibility &equals;&equals;&equals; &lsquo;good&lsquo; &verbar;&verbar;
                  tags&period;trail_visibility &equals;&equals;&equals; &lsquo;intermediate&lsquo;
                &rpar; &lcub;
                type &equals; &lsquo;hiking&lsquo;;
              &rcub; else &lcub;
                type &equals; &lsquo;herdpath&lsquo;;
              &rcub;
            &rcub; else if &lpar;tags&period;highway&rpar; &lcub;
              if &lpar;tags&period;highway &equals;&equals;&equals; &lsquo;path&lsquo;&rpar; &lcub;
                if &lpar;tags&period;surface&rpar; &lcub;
                  if &lpar;tags&period;surface &equals;&equals;&equals; &lsquo;compacted&lsquo; &verbar;&verbar; tags&period;surface &equals;&equals;&equals; &lsquo;fine_gravel&lsquo; &verbar;&verbar;
                      tags&period;surface &equals;&equals;&equals; &lsquo;gravel&lsquo; &verbar;&verbar; tags&period;surface &equals;&equals;&equals; &lsquo;pebblestone&lsquo; &verbar;&verbar;
                      tags&period;surface &equals;&equals;&equals; &lsquo;ground&lsquo; &verbar;&verbar; tags&period;surface &equals;&equals;&equals; &lsquo;dirt&lsquo; &verbar;&verbar;
                      tags&period;surface &equals;&equals;&equals; &lsquo;earth&lsquo; &verbar;&verbar; tags&period;surface &equals;&equals;&equals; &lsquo;grass&lsquo; &verbar;&verbar;
                      tags&period;surface &equals;&equals;&equals; &lsquo;mud&lsquo; &verbar;&verbar; tags&period;surface &equals;&equals;&equals; &lsquo;sand&lsquo; &verbar;&verbar;
                      tags&period;surface &equals;&equals;&equals; &lsquo;woodchips&lsquo; &verbar;&verbar; tags&period;surface &equals;&equals;&equals; &lsquo;snow&lsquo;
                    &rpar; &lcub;
                    type &equals; &lsquo;trail&lsquo;;
                  &rcub; else &lcub;
                    type &equals; &lsquo;path&lsquo;;
                  &rcub;
                &rcub; else &lcub;
                  type &equals; &lsquo;path&lsquo;;
                &rcub;
              &rcub; else if &lpar;tags&period;highway &equals;&equals;&equals; &lsquo;track&lsquo;&rpar; &lcub;
                if &lpar;tags&period;tracktype &amp;&amp; tags&period;tracktype &equals;&equals;&equals; &lsquo;grade1&lsquo;&rpar; &lcub;
                  type &equals; &lsquo;backroad&lsquo;;
                &rcub; else &lcub;
                  type &equals; &lsquo;dirtroad&lsquo;;
                &rcub;
              &rcub; else if &lpar;tags&period;highway &equals;&equals;&equals; &lsquo;footway&lsquo;&rpar; &lcub;
                type &equals; &lsquo;trail&lsquo;;
              &rcub; else if &lpar;tags&period;highway &equals;&equals;&equals; &lsquo;steps&lsquo;&rpar; &lcub;
                type &equals; &lsquo;stairs&lsquo;;
              &rcub; else if &lpar;tags&period;highway &equals;&equals;&equals; &lsquo;bridleway&lsquo;&rpar; &lcub;
                type &equals; &lsquo;bridleway&lsquo;;
                allowsHorses &equals; true;
              &rcub; else if &lpar;tags&period;highway &equals;&equals;&equals; &lsquo;cycleway&lsquo;&rpar; &lcub;
                type &equals; &lsquo;cycleway&lsquo;;
                allowsBikes &equals; true;
              &rcub; else &lcub;
                type &equals; &lsquo;path&lsquo;;
              &rcub;
            &rcub; else &lcub;
              type &equals; null;
            &rcub;

            if &lpar;tags&period;smoothness&rpar; &lcub;
              if &lpar;tags&period;smoothness &equals;&equals;&equals; &lsquo;impassable&lsquo;&rpar; &lcub;
                allowsBikes &equals; false;
              &rcub; else &lcub;
                allowsBikes &equals; true;
              &rcub;
            &rcub;
            if &lpar;tags&period;cycleway&rpar; &lcub;
              allowsBikes &equals; true;
            &rcub;
            if &lpar;tags&lsqb;&lsquo;mtb:scale&lsquo;&bsol;&rpar; &lcub;
              allowsBikes &equals; true;
            &rcub;
            if &lpar;tags&lsqb;&lsquo;access:bicycle&lsquo;&bsol;&rpar; &lcub;
              if &lpar;tags&lsqb;&lsquo;access:bicycle&lsquo;&bsol; &equals;&equals;&equals; &lsquo;yes&lsquo;&rpar; &lcub;
                allowsBikes &equals; true;
              &rcub; else &lcub;
                allowsBikes &equals; false;
              &rcub;
            &rcub;
            if &lpar;tags&lsqb;&lsquo;access:bike&lsquo;&bsol;&rpar; &lcub;
              if &lpar;tags&lsqb;&lsquo;access:bike&lsquo;&bsol; &equals;&equals;&equals; &lsquo;yes&lsquo;&rpar; &lcub;
                allowsBikes &equals; true;
              &rcub; else &lcub;
                allowsBikes &equals; false;
              &rcub;
            &rcub;
            if &lpar;tags&lsqb;&lsquo;access:horse&lsquo;&bsol;&rpar; &lcub;
              if &lpar;tags&lsqb;&lsquo;access:horse&lsquo;&bsol; &equals;&equals;&equals; &lsquo;yes&lsquo;&rpar; &lcub;
                allowsHorses &equals; true;
              &rcub; else &lcub;
                allowsHorses &equals; false;
              &rcub;
            &rcub;
            if &lpar;tags&period;equestrian&rpar; &lcub;
              if &lpar;tags&period;equestrian &equals;&equals;&equals; &lsquo;yes&lsquo;&rpar; &lcub;
                allowsHorses &equals; true;
              &rcub; else &lcub;
                allowsHorses &equals; false;
              &rcub;
            &rcub;
            if &lpar;tags&lsqb;&lsquo;access::ski:nordic&lsquo;&bsol;&rpar; &lcub;
              if &lpar;tags&lsqb;&lsquo;access::ski:nordic&lsquo;&bsol; &equals;&equals;&equals; &lsquo;yes&lsquo;&rpar; &lcub;
                skiTrail &equals; true;
              &rcub; else &lcub;
                skiTrail &equals; false;
              &rcub;
            &rcub;
            if &lpar;tags&lsqb;&lsquo;ski:nordic&lsquo;&bsol;&rpar; &lcub;
              if &lpar;tags&lsqb;&lsquo;ski:nordic&lsquo;&bsol; &equals;&equals;&equals; &lsquo;yes&lsquo;&rpar; &lcub;
                skiTrail &equals; true;
              &rcub; else &lcub;
                skiTrail &equals; false;
              &rcub;
            &rcub;

            let waterCrossing &equals; null;
            if &lpar;tags&period;ford&rpar; &lcub;
              if &lpar;tags&period;ford &equals;&equals;&equals; &lsquo;yes&lsquo;&rpar; &lcub;
                waterCrossing &equals; &lsquo;ford&lsquo;;
              &rcub; else if &lpar;tags&period;ford &equals;&equals;&equals; &lsquo;stepping_stones&lsquo;&rpar; &lcub;
                waterCrossing &equals; &lsquo;stones&lsquo;;
              &rcub;
            &rcub;

            if &lpar;&lpar;name &verbar;&verbar; type&rpar; &amp;&amp; &excl;sidewalk&rpar; &lcub;
              if &lpar;geometry&period;type &equals;&equals;&equals; &lsquo;Polygon&lsquo;&rpar; &lcub;
                geometry&period;type &equals; &lsquo;LineString&lsquo;;
                const line_string &equals; &lsqb;&bsol;;
                geometry&period;coordinates&period;forEach&lpar;coords &equals;> line_string&period;push&lpar;&period;&period;&period;coords&rpar;&rpar;;
                geometry&period;coordinates &equals; line_string;
              &rcub;

              const start &equals; geometry&period;coordinates&lsqb;0&bsol;;
              const end &equals; geometry&period;coordinates&lsqb;geometry&period;coordinates&period;length - 1&bsol;;

              const coordinates_to_check &equals; geometry&period;coordinates&period;length > 250
                ? geometry&period;coordinates : &lsqb;start, Math&period;floor&lpar;geometry&period;coordinates&period;length &sol; 2&rpar;, end&bsol;;
              let outside_us &equals; false;
              const states &equals; &lsqb;&bsol;;
              coordinates_to_check&period;forEach&lpar;&lpar;coord, i&rpar; &equals;> &lcub;
                if&lpar; i &equals;&equals;&equals; 0 &verbar;&verbar; i &equals;&equals;&equals; coordinates_to_check&period;length - 1     &verbar;&verbar;
                    i &equals;&equals;&equals; Math&period;floor&lpar;coordinates_to_check&period;length * 0&period;05&rpar; &verbar;&verbar;
                    i &equals;&equals;&equals; Math&period;floor&lpar;coordinates_to_check&period;length * 0&period;10&rpar; &verbar;&verbar;
                    i &equals;&equals;&equals; Math&period;floor&lpar;coordinates_to_check&period;length * 0&period;15&rpar; &verbar;&verbar;
                    i &equals;&equals;&equals; Math&period;floor&lpar;coordinates_to_check&period;length * 0&period;20&rpar; &verbar;&verbar;
                    i &equals;&equals;&equals; Math&period;floor&lpar;coordinates_to_check&period;length * 0&period;25&rpar; &verbar;&verbar;
                    i &equals;&equals;&equals; Math&period;floor&lpar;coordinates_to_check&period;length * 0&period;30&rpar; &verbar;&verbar;
                    i &equals;&equals;&equals; Math&period;floor&lpar;coordinates_to_check&period;length * 0&period;35&rpar; &verbar;&verbar;
                    i &equals;&equals;&equals; Math&period;floor&lpar;coordinates_to_check&period;length * 0&period;40&rpar; &verbar;&verbar;
                    i &equals;&equals;&equals; Math&period;floor&lpar;coordinates_to_check&period;length * 0&period;45&rpar; &verbar;&verbar;
                    i &equals;&equals;&equals; Math&period;floor&lpar;coordinates_to_check&period;length * 0&period;50&rpar; &verbar;&verbar;
                    i &equals;&equals;&equals; Math&period;floor&lpar;coordinates_to_check&period;length * 0&period;55&rpar; &verbar;&verbar;
                    i &equals;&equals;&equals; Math&period;floor&lpar;coordinates_to_check&period;length * 0&period;60&rpar; &verbar;&verbar;
                    i &equals;&equals;&equals; Math&period;floor&lpar;coordinates_to_check&period;length * 0&period;65&rpar; &verbar;&verbar;
                    i &equals;&equals;&equals; Math&period;floor&lpar;coordinates_to_check&period;length * 0&period;70&rpar; &verbar;&verbar;
                    i &equals;&equals;&equals; Math&period;floor&lpar;coordinates_to_check&period;length * 0&period;75&rpar; &verbar;&verbar;
                    i &equals;&equals;&equals; Math&period;floor&lpar;coordinates_to_check&period;length * 0&period;80&rpar; &verbar;&verbar;
                    i &equals;&equals;&equals; Math&period;floor&lpar;coordinates_to_check&period;length * 0&period;85&rpar; &verbar;&verbar;
                    i &equals;&equals;&equals; Math&period;floor&lpar;coordinates_to_check&period;length * 0&period;90&rpar; &verbar;&verbar;
                    i &equals;&equals;&equals; Math&period;floor&lpar;coordinates_to_check&period;length * 0&period;95&rpar;
                  &rpar; &lcub;
                  const is_inside &equals; inside&period;feature&lpar;usa_geojson, coord&rpar;;
                  if &lpar;is_inside &excl;&equals;&equals; -1 &amp;&amp; is_inside&period;properties &amp;&amp;
                      is_inside&period;properties&period;NAME &amp;&amp; &excl;states&period;includes&lpar;is_inside&period;properties&period;NAME&rpar;&rpar; &lcub;
                    states&period;push&lpar;is_inside&period;properties&period;NAME&rpar;;
                  &rcub; else &lcub;
                    const is_outside &equals; inside&period;feature&lpar;other_countries_geojson, coord&rpar;;
                    if &lpar;is_outside &excl;&equals;&equals; -1&rpar; &lcub;
                      outside_us &equals; true;
                    &rcub;
                  &rcub;
                &rcub;
              &rcub;&rpar;
              if &lpar;&excl;outside_us&rpar; &lcub;
                const datum &equals; &lcub;
                  osmId,
                  name,
                  type,
                  states,
                  geometry,
                  start,
                  end,
                &rcub;
                if &lpar;allowsBikes &excl;&equals;&equals; null&rpar; &lcub;
                  datum&period;allowsBikes &equals; allowsBikes;
                &rcub;
                if &lpar;allowsHorses &excl;&equals;&equals; null&rpar; &lcub;
                  datum&period;allowsHorses &equals; allowsHorses;
                &rcub;
                if &lpar;skiTrail &excl;&equals;&equals; null&rpar; &lcub;
                  datum&period;skiTrail &equals; skiTrail;
                &rcub;
                if &lpar;waterCrossing &excl;&equals;&equals; null&rpar; &lcub;
                  datum&period;waterCrossing &equals; waterCrossing;
                &rcub;
                cleaned_features&period;push&lpar;datum&rpar;;
                featureProgressIds&period;push&lpar;osmId&rpar;;
                fs&period;writeFileSync&lpar;included_ids, JSON&period;stringify&lpar;featureProgressIds&rpar;&rpar;;
              &rcub;
            &rcub;
          &rcub;

        &rcub;&rpar;
        const filename &equals; output_folder  + file;
        fs&period;writeFileSync&lpar;filename, JSON&period;stringify&lpar;cleaned_features&rpar;&rpar;;
      &rcub;

      tileProgressIds&period;push&lpar;tileId&rpar;;
      fs&period;writeFileSync&lpar;progress_file_name, JSON&period;stringify&lpar;tileProgressIds&rpar;&rpar;;
  &rcub;
&rcub;&rpar;;


        `}}
    />
  );
};

export default TrailScripts;
