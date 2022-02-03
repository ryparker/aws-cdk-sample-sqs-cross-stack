import { App, Stack } from "aws-cdk-lib";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { EventBus, Rule } from "aws-cdk-lib/aws-events";
import { SqsQueue } from "aws-cdk-lib/aws-events-targets";

const app = new App();

// Stack A
const queueProducerStack = new Stack(app, "QueueProducer");
const mainQueue = new Queue(queueProducerStack, "MainQueue");

// Stack B
const queueConsumerStack = new Stack(app, "QueueConsumer");
const eventBus = new EventBus(queueConsumerStack, "EventBus");
const eventRule = new Rule(queueConsumerStack, "MyRule", {
  eventBus,
  eventPattern: {
    account: [Stack.of(queueConsumerStack).account],
  },
});
const mainQueueRef = Queue.fromQueueArn(
  queueConsumerStack,
  "MainQueueRef",
  mainQueue.queueArn
);
const sqsQueue = new SqsQueue(mainQueueRef);
eventRule.addTarget(sqsQueue);
