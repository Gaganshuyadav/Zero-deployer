


export const kafkaTopicPartitionFormatKey = ( topic:string, partition:Number)=>{
    return `${topic}-${partition}`;
}