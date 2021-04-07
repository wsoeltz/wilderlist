/* eslint-disable max-len */
/* tslint:disable:max-line-length */
import React, {useState} from 'react';
import {
  ContainerContent,
  DottedSegment,
  LinkButtonCompact,
} from '../../styling/styleUtils';
import Modal from '../sharedComponents/Modal';
import TrailScripts from './TrailScripts';

const AboutData = () => {
  const [trailScriptsModalOpen, setTrailScriptsModalOpen] = useState<boolean>(false);
  const trailScriptsModal = trailScriptsModalOpen ? (
    <div onClick={() => setTrailScriptsModalOpen(false)}>
      <Modal
        onClose={() => setTrailScriptsModalOpen(false)}
        actions={null}
        width={'auto'}
        height={'auto'}
      >
        <TrailScripts />
      </Modal>
    </div>
  ) : null;
  return (
    <>
      <ContainerContent>
        <h2>Disclaimer</h2>
        <p><strong>{'Wilderlist makes no warranties, expressed or implied, concerning the accuracy, completeness or suitability of the information and data provided through the application, and such information and data should not be construed or used as a legal description. Activities associated with the application can at times involve risk of injury, death, property damage, and other dangers associated with such activities. You understand that Wilderlist cannot and does not assume responsibility for any such personal injury, death, or property damage resulting from your use of the application. Wilderlist is not responsible for the misuse or misrepresentation of the information and/or data provided through the application, and any reliance you place on such information and/or data is therefore strictly at your own risk.'}</strong>
        </p>
        <hr />
        <h4>Mountain data</h4>
        <p>{'Mountain data for the USA is primarily derived from the public domain United States Geographic Names Information System Summits by ESRI and USGS. The data has since been enhanced through additional data analysis techniques and public crowd sourcing.'}</p>
      </ContainerContent>
      <DottedSegment>
        <h4>Weather forecasts</h4>
        <p>{'Weather forecasts for the USA are primarily sourced from the National Weather Service. In the event that a forecast fails, the online service, Open Weather Maps, is used as a backup.'}</p>
      </DottedSegment>
      <DottedSegment>
        <h4>Snow reports</h4>
        <p>{'Snow reports in the USA are derived from data released by the National Oceanic Administration\'s National Centers for Environmental Information.'}</p>
      </DottedSegment>
      <DottedSegment>
        <h4>Weather overlays</h4>
        <p>{'The precipitation weather overlay is provided via RainViewer. All other weather overlays are provided via Open Weather Maps.'}</p>
      </DottedSegment>
      <DottedSegment>
        <h4>Trail data</h4>
        <p>{'Trail data is primarily derived from Open Street Map data. The below link includes the source code for fetching and cleaning the data from the OSM database in order to prepare it for the Wilderlist database, as per the requirements found in the OSM license, Attribution-ShareAlike 2.0 Generic (CC BY-SA 2.0).'}</p>
        <p>
          <LinkButtonCompact onClick={() => setTrailScriptsModalOpen(v => !v)}>
            View Script
          </LinkButtonCompact>
        </p>
        {trailScriptsModal}
      </DottedSegment>
      <DottedSegment>
        <h4>Campsite data</h4>
        <p>{'Campsite data is primarily derived from Open Street Map data. It uses the same methodology found in the above script but slightly modified to target the following: node[tourism=camp_pitch],  node[tourism=camp_site],  node[tourism=caravan_site],  node[tourism=alpine_hut],  node[tourism=wilderness_hut],  node[amenity=shelter],  way[tourism=camp_pitch],  way[tourism=camp_site],  way[tourism=caravan_site],  way[tourism=alpine_hut],  way[tourism=wilderness_hut],  way[amenity=shelter]'}</p>
      </DottedSegment>
      <DottedSegment>
        <h4>Parking and roads data</h4>
        <p>{'Parking and roads data is primarily derived from Open Street Map data. It uses the same methodology found in the above script but slightly modified to target the following, respectively: node[amenity=parking],  node[amenity=parking_aisle],  node[amenity=parking_space],  node[service=parking_aisle],  node[highway=trailhead],  node[information=board],  node[information=map],  node[tourism=picnic_site],  way[amenity=parking],  way[amenity=parking_aisle],  way[amenity=parking_space],  way[service=parking_aisle],  way[highway=trailhead],  way[information=board],  way[information=map],  way[tourism=picnic_site] and way[highway=path][foot=no], way[highway=track][foot=no], way[highway=motorway], way[highway=primary], way[highway=secondary], way[highway=unclassified], way[highway=residential], way[highway=living_street], way[highway=service], way[highway=road], way[highway=motorway_link], way[highway=trunk_link], way[highway=primary_link], way[highway=secondary_link], way[highway=tertiary_link], way[highway=trunk], way[highway=tertiary]'}</p>
      </DottedSegment>
    </>
  );
};

export default AboutData;
