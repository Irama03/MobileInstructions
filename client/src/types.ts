export type Instruction = {
  id: number;
  name: string;
  category: Category;
  devices: Device[];
  steps: Step[];
  likes_quant: number;
  dislikes_quant: number
};

export type Category = {
  id: number;
  name: string;
}

export type Device = {
  id: number;
  name: string
}

export type Step = {
  id: number,
  order: number,
  content: string
}

export enum Commands {
  DO_NOTHING,
  START_READ_STEP,
  STOP_READ_STEP,
  REPEAT_READ_STEP,
  STEP_IS_DONE
}
