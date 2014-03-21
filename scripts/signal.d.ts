﻿declare module porcelain {
    /**
    * The Slot interface.
    */
    interface ISlot<T> {
        (param: T): void;
    }
    /**
    * The Signal class.
    *
    * A Signal provides a type-safe on-to-many notification mechanism.
    * It allows objects to broadcast information without regard as to
    * whether or not anything is listening.
    *
    * @class
    */
    class Signal<T> {
        /**
        * Connect a slot to the signal.
        *
        * The slot will be invoked when the signal is emitted. The
        * parameter emitted by the signal will be passed to the slot.
        * If the slot is already connect, this is a no-op.
        *
        * @param slot - the function to connect to the signal
        */
        public connect(slot: ISlot<T>): void;
        /**
        * Disconnect a slot from the signal.
        *
        * If the slot is not connected to the signal, this is a no-op.
        * If no slot is provided, all slots will be disconnected.
        *
        * @param slot - the function to disconnect from the signal
        */
        public disconnect(slot?: ISlot<T>): void;
        /**
        * Emit the signal with the given parameter.
        *
        * This will invoke all slots with the provided parameter in
        * the order in which they were connected. It is safe to
        * connect and disconnect slots while the signal is emitting.
        *
        * @param param - the parameter to pass to the slots
        */
        public emit(param: T): void;
        private _slots;
    }
}
