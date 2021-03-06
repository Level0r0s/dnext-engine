import Node from './Node';
import Font from './paint/Font';
import ImageView from './ImageView';
import Utils from './util/Utils';

class Labeled extends Node {
    constructor(text, graphic) {
        super();
        this.textType = 'text';
        this.contentDisplay = 'left';
        this.graphicTextGap = 4;
        this.graphic = graphic;
        this.text = text;
        this.align = ['center', 'center'];
    }

    get font() {
      return Font.getFromDom(this.dom);
    }

    set font(value) {
      Font.applyToDom(this.dom, value);
    }

    get align() {
      return [this.verAlign, this.horAlign];
    }

    set align(value) {
      if (value instanceof Array && value.length >= 2) {
        this.horAlign = value[1];
        this.verAlign = value[0];
      }
    }

    get horAlign() {
      if (this.dom.hasClass('ux-m-halign-right')) {
        return 'right';
      } else if (this.hasClass('ux-m-halign-center')) {
        return 'center';
      }

      return 'left';
    }

    set horAlign(value) {
      this.dom.removeClass('ux-m-halign-left');
      this.dom.removeClass('ux-m-halign-right');
      this.dom.removeClass('ux-m-halign-center');

      this.dom.addClass('ux-m-halign-' + value);
    }

    get verAlign() {
      if (this.dom.hasClass('ux-m-valign-bottom')) {
        return 'bottom';
      } else if (this.hasClass('ux-m-valign-center')) {
        return 'center';
      }

      return 'top';
    }

    set verAlign(value) {
      this.dom.removeClass('ux-m-valign-top');
      this.dom.removeClass('ux-m-valign-bottom');
      this.dom.removeClass('ux-m-valign-center');

      this.dom.addClass('ux-m-valign-' + value);
    }

    get text() {
      switch (this.textType) {
        case 'text':
          return this.dom.find('> span.ux-labeled-text').text();
        case 'html':
          return this.dom.find('> span.ux-labeled-text').html();
      }

      return '';
    }

    set text(value) {
      switch (this.textType) {
        case 'text':
          this.dom.find('> span.ux-labeled-text').text(value);
          break;

        case 'html':
          this.dom.find('> span.ux-labeled-text').html(value);
          break;
      }
    }

    get textColor() {
      return this.dom.css('color');
    }

    set textColor(value) {
      this.dom.css('color', value ? value : '');
    }

    get textType() {
      return this._textType;
    }

    set textType(value) {
      var text = this.text;
      var graphic = this.graphic;

      if (value) {
        this._textType = value.toString().toLowerCase();
      } else {
        this._textType = 'text';
      }

      this.text = text;
      this.graphic = graphic;
    }

    get contentDisplay() {
      if (this.dom.first().hasClass('ux-graphic')) {
        if (this.dom.hasClass('ux-labeled-vertical')) {
          return 'top';
        } else {
          return 'left';
        }
      } else if (this.dom.last().hasClass('ux-graphic')) {
        if (this.dom.hasClass('ux-labeled-vertical')) {
          return 'bottom';
        } else {
          return 'right';
        }
      } else {
        return this._contentDisplay;
      }
    }

    set contentDisplay(value) {
      var graphic = this.graphic;
      var graphicGap = this.graphicTextGap;
      this._contentDisplay = value;

      switch (value) {
        case 'top':
        case 'bottom':
          this.dom.addClass('ux-labeled-vertical');
          break;

        case 'right':
          this.dom.removeClass('ux-labeled-vertical');
          break;

        case 'left':
        default:
          this.dom.removeClass('ux-labeled-vertical');
          this._contentDisplay = 'left';
          break;
      }

      this.graphic = graphic;
      this.graphicTextGap = graphicGap;
    }

    get graphicTextGap() {
      var grDom = this.dom.find('.ux-graphic');

      if (grDom.length) {
        var prop = 'margin-right';

        switch (this.contentDisplay) {
          case 'bottom': prop = 'margin-top'; break;
          case 'right': prop = 'margin-left'; break;
          case 'top': prop = 'margin-bottom'; break;
        }

        return Utils.toPt(grDom.css(prop));
      } else {
        return this._graphicGap;
      }
    }

    set graphicTextGap(value) {
      this._graphicGap = value;

      var grDom = this.dom.find('.ux-graphic');

      if (grDom.length) {
        grDom.css('margin', 0);

        var prop = 'margin-right';

        switch (this.contentDisplay) {
          case 'bottom': prop = 'margin-top'; break;
          case 'right': prop = 'margin-left'; break;
          case 'top': prop = 'margin-bottom'; break;
        }

        grDom.css(prop, value + 'px');
      }
    }

    get graphic() {
      return Node.getFromDom(this.dom.find('.ux-graphic > *').first());
    }

    set graphic(node) {
      var graphicGap = this.graphicTextGap;
      this.dom.find('.ux-graphic').remove();

      if (node) {
        if (typeof node === 'string' || node instanceof String) {
          node = new ImageView(node);
        }

        var dom = jQuery('<span class="ux-graphic" />').append(node.dom);

        switch (this.contentDisplay) {
          case 'top':
          case 'left':
            this.dom.prepend(dom);
            break;
          case 'bottom':
          case 'right':
            this.dom.append(dom);
            break;
        }

        this.graphicTextGap = graphicGap;
      }
    }
}

export default Labeled;
