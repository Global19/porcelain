﻿/*-----------------------------------------------------------------------------
| Copyright (c) 2014, Nucleic Development Team.
|
| Distributed under the terms of the Modified BSD License.
|
| The full license is in the file COPYING.txt, distributed with this software.
|----------------------------------------------------------------------------*/
module porcelain {

    /**
     * The class added to a SizeGrip instance.
     */
    var SIZE_GRIP_CLASS = "p-SizeGrip";

    /**
     * The prefix for the grip area class added to a size grip.
     */
    var GRIP_AREA_PREFIX = "p-GripArea-";

    
    /**
     * The areas which define the behavior of a size grip.
     */
    export enum GripArea {
        Left,
        Top,
        Right,
        Bottom,
        TopLeft,
        TopRight,
        BottomLeft,
        BottomRight
    }


    /**
     * A widget which enables mouse resizing of an adjustable item.
     *
     * @class
     */
    export class SizeGrip extends Component {

        /**
         * The mousedown event binder.
         */
        mousedown = new EventBinder("mousedown", this.element);

        /**
         * The mouseup event binder.
         */
        mouseup = new EventBinder("mouseup", document);

        /**
         * The mousemove event binder.
         */
        mousemove = new EventBinder("mousemove", document);

        /**
         * Construct a new SizeGrip.
         *
         * @param gripArea The grip area defining the size grip behavior.
         * @param target The component to resize with the grip.
         */
        constructor(gripArea: GripArea, target: Component) {
            super();
            this._gripArea = gripArea;
            this._item = new ComponentItem(target);
            this.addClass(SIZE_GRIP_CLASS);
            this.addClass(GRIP_AREA_PREFIX + GripArea[gripArea]);
            this.mousedown.bind(this.onMouseDown, this);
        }

        /**
         * Destroy the edge grip.
         */
        destroy(): void {
            super.destroy();
            this._item.component = null;
            this._item = null;
        }

        /**
         * The grip area defining the size grip behavior.
         *
         * @readonly
         */
        get gripArea(): GripArea {
            return this._gripArea;
        }

        /**
         * The target component resized by the size grip.
         *
         * @readonly
         */
        get target(): Component {
            return this._item.component;
        }

        /**
         * The mousedown handler.
         *
         * @protected
         */
        onMouseDown(event: MouseEvent): void {
            if (event.button !== 0) {
                return;
            }
            event.preventDefault();
            this.mouseup.bind(this.onMouseUp, this);
            this.mousemove.bind(this.onMouseMove, this);
            var rect = this._item.offsetRect();
            switch (this._gripArea) {
                case GripArea.Left:
                case GripArea.TopLeft:
                case GripArea.BottomLeft:
                    this._offsetX = event.pageX - rect.left;
                    break;
                case GripArea.Right:
                case GripArea.TopRight:
                case GripArea.BottomRight:
                    this._offsetX = event.pageX - rect.right;
                    break;
            }
            switch (this._gripArea) {
                case GripArea.Top:
                case GripArea.TopLeft:
                case GripArea.TopRight:
                    this._offsetY = event.pageY - rect.top;
                    break;
                case GripArea.Bottom:
                case GripArea.BottomLeft:
                case GripArea.BottomRight:
                    this._offsetY = event.pageY - rect.bottom;
                    break;
                default:
                    break;
            }
        }

        /**
         * The mouseup handler.
         *
         * @protected
         */
        onMouseUp(event: MouseEvent): void {
            if (event.button !== 0) {
                return;
            }
            event.preventDefault();
            this.mouseup.unbind(this.onMouseUp, this);
            this.mousemove.unbind(this.onMouseMove, this);
            this._offsetX = 0;
            this._offsetY = 0;
        }

        /**
         * The mousemove handler.
         *
         * @protected
         */
        onMouseMove(event: MouseEvent): void {
            event.preventDefault();
            var vp = viewport;
            var item = this._item;
            var rect = item.offsetRect();
            var minSize = item.minimumSize();
            var maxSize = item.maximumSize();
            var x = event.pageX - this._offsetX;
            var y = event.pageY - this._offsetY;
            x = Math.min(Math.max(vp.left, x), vp.windowRight);
            y = Math.min(Math.max(vp.top, y), vp.windowBottom);
            var minX: number, maxX: number;
            switch (this._gripArea) {
                case GripArea.Left:
                case GripArea.TopLeft:
                case GripArea.BottomLeft:
                    minX = rect.right - maxSize.width;
                    maxX = rect.right - minSize.width;
                    rect.left = Math.min(Math.max(minX, x), maxX);
                    break;
                case GripArea.Right:
                case GripArea.TopRight:
                case GripArea.BottomRight:
                    minX = rect.left + minSize.width;
                    maxX = rect.left + maxSize.width;
                    rect.right = Math.min(Math.max(minX, x), maxX);
                    break;
                default:
                    break;
            }
            var minY: number, maxY: number;
            switch (this._gripArea) {
                case GripArea.Top:
                case GripArea.TopLeft:
                case GripArea.TopRight:
                    minY = rect.bottom - maxSize.height;
                    maxY = rect.bottom - minSize.height;
                    rect.top = Math.min(Math.max(minY, y), maxY);
                    break;
                case GripArea.Bottom:
                case GripArea.BottomLeft:
                case GripArea.BottomRight:
                    minY = rect.top + minSize.height;
                    maxY = rect.top + maxSize.height;
                    rect.bottom = Math.min(Math.max(minY, y), maxY);
                    break;
                default:
                    break;
            }
            item.setOffsetRect(rect);
        }

        private _gripArea: GripArea;
        private _item: ComponentItem;
        private _offsetX: number = 0;
        private _offsetY: number = 0;
    }

}
