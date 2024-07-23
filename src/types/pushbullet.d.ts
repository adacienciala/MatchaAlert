declare module 'pushbullet' {
  export interface PushBulletOptions {
    full_name?: string;
  }

  export interface NoteResponse {
    iden: string;
    title: string;
    body: string;
  }

  export type Callback = (error: Error | null, response: NoteResponse) => void;

  class PushBullet {
    constructor(apiKey: string);
    note(
      deviceParams: {},
      title: string,
      body: string,
      callback: Callback
    ): void;
  }

  export default PushBullet;
}
