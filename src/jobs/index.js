import schedule from 'node-schedule';
import missionTasks from './mission';

export default function start() {
  const tasks = [].concat(missionTasks);
  tasks.forEach((task) => {
    schedule.scheduleJob(task.fireAt, task.excute);
  });
}
