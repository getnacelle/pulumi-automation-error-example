import * as aws from '@pulumi/aws';

const lambda = new aws.lambda.CallbackFunction('mylambda', {
  callback: async () => ({ statusCode: 200 })
});
