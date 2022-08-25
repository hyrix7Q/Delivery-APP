export const GET_JOB = "GET_JOB";

export const getJob = (job) => {
  return {
    type: GET_JOB,
    job: job,
  };
};
