import GD from "../GD";

const TOAST_ACTIVE_TIME = 20000;

class ToastManager {
  private toasts: Map<string, ToastVO> = new Map();

  constructor() {
    GD.REQ_TOASTS.listener = (data: void, callback: (value: ToastVO[]) => void) => {
      callback(Array.from(this.toasts.values()));
    };

    GD.S_TOAST.add((txt) => {
      const tempUID: string = btoa(Math.random() * 10000 + "_" + +new Date());

      this.toasts.set(tempUID, {
        state: "active",
        text: txt,
        created: +new Date(),
        tempUID: tempUID,
      });

      setTimeout(() => {
        GD.S_TOAST_DELETE.invoke(tempUID);
      }, TOAST_ACTIVE_TIME);
    });

    GD.S_TOAST_DELETE.add((tempUID) => {
      this.toasts.delete(tempUID);
    });

    GD.S_SERVICE_READY.invoke("toastManager");
  }
}

export default ToastManager;