// Definindo os tipos de dados para cada signal
type SignalDataMap = {
  reloadPage: undefined;
  spawnAdvice: { title: string; desc: string };
  "": undefined;
};

export type SignalType = keyof SignalDataMap;

class Signal {
  signal = $state<{
    type: SignalType;
    data: any;
  }>({
    type: "",
    data: {},
  });

  onSubscribe<T extends SignalType>(
    type: T,
    fn: (data: SignalDataMap[T]) => void
  ) {
    $effect(() => {
      if (this.signal.type === type) {
        fn(this.signal.data);
      }
    });
  }

  resetSignal() {
    this.signal = {
      type: "",
      data: {},
    };
  }

  sendSignal<T extends SignalType>(tipo: T, data?: SignalDataMap[T]) {
    this.signal = {
      type: tipo,
      data,
    };
    setTimeout(() => this.resetSignal(), 200);
  }
}

const signal = new Signal();

export default signal;
