import Job from "../models/Job.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import checkPermission from "../utils/checkPermission.js";

const createJob = async (req, res) => {
  const { position, company } = req.body;

  if (!position || !company) {
    throw new BadRequestError("Please provide all values");
  }
  req.body.createdBy = req.user.userId;

  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;

  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    throw new NotFoundError(`No job with id : ${jobId}`);
  }

  checkPermission(req.user, job.createdBy);

  await job.remove();
  res.status(StatusCodes.OK).json({ msg: "success Job removed" });
};

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId });

  res
    .status(StatusCodes.OK)
    .json({ jobs, totalJobs: jobs.length, numberOfPages: 1 });
};

const updateJob = async (req, res) => {
  const { id: jobId } = req.params;

  const { company, position, jobLocation } = req.body;

  if ((!company, !position)) {
    throw new BadRequestError("Please provide All values");
  }

  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }

  //checkpermissions
  //option 1
  // const updatedJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
  //   new: true,
  //   runValidators: true,
  // });

  checkPermission(req.user, job.createdBy);

  job.position = position;
  job.jobLocation = jobLocation;
  job.company = company;

  await job.save();

  res.status(StatusCodes.OK).json({ job });
};

const showStats = async (req, res) => {
  res.send("Show Stats");
};

export { createJob, deleteJob, getAllJobs, updateJob, showStats };
