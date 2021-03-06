import {
  IconButton,
  Menu,
  MenuItem,
  TableCell,
  Typography,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import React from 'react';
import { useTranslation } from 'react-i18next';
import LinearProgressBar from '../../../components/ProgressBar/LinearProgressBar';
import {
  ExecutionData,
  WorkflowRun,
} from '../../../models/graphql/workflowData';
import { history } from '../../../redux/configureStore';
import timeDifferenceForDate from '../../../utils/datesModifier';
import { getProjectID, getProjectRole } from '../../../utils/getSearchParams';
import CustomStatus from '../CustomStatus/Status';
import useStyles from './styles';

interface TableDataProps {
  data: WorkflowRun;
  exeData: ExecutionData;
}

const TableData: React.FC<TableDataProps> = ({ data, exeData }) => {
  const classes = useStyles();
  const projectID = getProjectID();
  const projectRole = getProjectRole();

  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  // Function to capitalize the first letter of the word
  // eg: internal to Internal
  const nameCapitalized = (clusterType: string) => {
    if (clusterType)
      return clusterType.charAt(0).toUpperCase() + clusterType.slice(1);
    return 'Not Available';
  };

  return (
    <>
      <TableCell className={classes.tableDataStatus}>
        <CustomStatus
          status={exeData.finishedAt.length === 0 ? 'Running' : exeData.phase}
        />
      </TableCell>
      <TableCell
        className={classes.workflowNameData}
        style={{ cursor: 'pointer' }}
        onClick={() => {
          history.push({
            pathname: `/workflows/${data.workflow_run_id}`,
            search: `?projectID=${projectID}&projectRole=${projectRole}`,
          });
        }}
      >
        <Typography data-cy="workflowName">
          <strong>{data.workflow_name}</strong>
        </Typography>
      </TableCell>
      <TableCell>
        <Typography className={classes.clusterName}>
          {nameCapitalized(data.cluster_name)}
        </Typography>
      </TableCell>
      <TableCell>
        <div className={classes.reliabiltyData}>
          {exeData.finishedAt.length === 0 ? (
            <Typography>
              {t('workflowDetails.overallRR')}
              <span className={classes.failed}>NA</span>
            </Typography>
          ) : exeData.phase === 'Failed' || exeData.phase === '' ? (
            <>
              <Typography>
                {t('workflowDetails.overallRR')}
                <span className={classes.failed}>0%</span>
              </Typography>
              <div className={classes.progressBar}>
                <LinearProgressBar width={0.1} value={0} />
              </div>
            </>
          ) : (
            <>
              <Typography>
                {t('workflowDetails.overallRR')}
                <span className={classes.success}>100%</span>
              </Typography>
              <div className={classes.progressBar}>
                <LinearProgressBar width={0.1} value={10} />
              </div>
            </>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Typography className={classes.stepsData}>
          {Object.keys(exeData.nodes).length}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography>{timeDifferenceForDate(data.last_updated)}</Typography>
      </TableCell>
      <TableCell>
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={handleClick}
          className={classes.optionBtn}
          data-cy="browseWorkflowOptions"
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={handleClose}
        >
          <MenuItem
            value="Workflow"
            onClick={() => {
              history.push({
                pathname: `/workflows/${data.workflow_run_id}`,
                search: `?projectID=${projectID}&projectRole=${projectRole}`,
              });
            }}
          >
            <div className={classes.expDiv} data-cy="workflowDetails">
              <img
                src="/icons/show-workflow.svg"
                alt="Display Workflow"
                className={classes.btnImg}
              />
              <Typography className={classes.btnText}>
                Show the workflow
              </Typography>
            </div>
          </MenuItem>
          <MenuItem
            value="Analysis"
            onClick={() => {
              history.push({
                pathname: `/workflows/analytics/${data.workflow_id}`,
                search: `?projectID=${projectID}&projectRole=${projectRole}`,
              });
            }}
          >
            <div className={classes.expDiv} data-cy="workflowAnalytics">
              <img
                src="/icons/show-analytics.svg"
                alt="Display Analytics"
                className={classes.btnImg}
              />
              <Typography className={classes.btnText}>
                Show the analytics
              </Typography>
            </div>
          </MenuItem>
          {/* <MenuItem value="Scheduler" onClick={handleMenu}>
            Show the scheduler
          </MenuItem> */}
        </Menu>
      </TableCell>
    </>
  );
};
export default TableData;
