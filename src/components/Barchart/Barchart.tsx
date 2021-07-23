import { useEffect, useState } from 'react';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryLabel, VictoryTooltip } from 'victory';
import { useKeys } from '../../hooks/use-keys';
import { useStats } from '../../hooks/use-stats';
import { hosts, mergeHosts } from '../../lib/stats';
import { IStats } from '../../types';
import flow from 'lodash.flow';
import { DropDown } from '../Dropdown';


export const Barchart = () => {
  const keys = useKeys();
  const [selectedOption, setSelectedOption] = useState<string>('');


  const stats = useStats(selectedOption);
  const getData = (stats: IStats) => flow([hosts, mergeHosts])(stats)

  if (stats) {

    console.log({ keys, stats, hosts: hosts(stats), merge: mergeHosts(hosts(stats)), data: getData(stats)  });
  }


  const handleSelectedOption = (selectedOption: string) =>
    setSelectedOption(selectedOption);


  return (
    <div className="" >
      <div className="flex justify-center w-48">
          <DropDown
            options={keys?.map(key => ({ title: key })) ?? []}
            defaultTitle="Choose a date"
            handleSelectedOption={handleSelectedOption}
          />  

      </div>
          <div>
              <VictoryChart
              //  padding={{ top: 40, bottom: 80, left: 40, right: 80 }}
      domainPadding={25}         
      theme={VictoryTheme.material}
      >
         <VictoryLabel text="Chart of Time(in Hours) against Hosts" x={225} y={30} textAnchor="middle"       style={[
        { fontSize: 4 },
      ]} />
        <VictoryAxis
          dependentAxis
          label="Time (hr)"
          style={{
            axisLabel: {fontSize: 8, padding: 30},
            tickLabels: {fontSize: 8}
          }}
        />
         <VictoryAxis
           tickFormat={stats ? getData(stats).map((host: any) => '') : []}
           label="hostname"
           style={{
            axisLabel: {fontSize: 6, padding: 10},
            tickLabels: {fontSize: 6}
          }}
           />
        <VictoryBar
        // labels={stats ? getData(stats).map((host: any) => host.hostName) : []}
          data={stats ? getData(stats): []}
          x="hostName"
          y="period"
          alignment="start"
          barRatio={0.5}
          labelComponent={
          <VictoryTooltip 
          constrainToVisibleArea
          />}
          style={{
            labels: { fontSize: 4 },
          }}
        />
      </VictoryChart>

          </div>
    </div>
  );
};
