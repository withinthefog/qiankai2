import React from 'react'
import Reflux from 'reflux'
import LinkedStateMixin from 'react/lib/LinkedStateMixin'
import { browserHistory } from 'react-router'
import cookie from 'react-cookie'

import CartStore from '../stores/cart'
import CartAction from '../actions/cart'
import MyAddressList from './cart/myaddresslist'
import CartActions from '../actions/cart'
import InvoiceEditor from './invoice-editor'
import WaitingForPayCartItemList from './cart/waiting-for-pay'

import mobileUtils from '../../../utils/mobile-utils'

//发票
var CartInvoice = React.createClass({
  editorLayerIndex: null,
  editInvoice: function () {
    this.editorLayerIndex = layer.open({
      type: 1,
      skin: 'layui-layer-demo', //样式类名
      shift: 2,
      shadeClose: true, //开启遮罩关闭
      maxWidth: 900,
      area: '500px',
      closeBtn: 1,
      title: '设置发票信息',
      content: $('#invoiceEditor')
    });
  },
  getInitialState: function () {
    return {
      enabled: false,
      invoiceTitle: ''
    }
  },
  saveInvoice: function (data) {
    CartActions.saveInvoice(data.enabled, data.invoiceTitle);
    this.setState(data);
    layer.close(this.editorLayerIndex);
  },
  unsaveInvoice: function () {
    layer.close(this.editorLayerIndex);
  },
  render: function () {
    //TODO:发票内容需要可定义
    if (this.state.enabled) {
      var text = '【发票抬头】' + this.state.invoiceTitle + '，【发票内容】商品明细';
    } else {
      var text = '不需要开发票';
    }
    return (
      <div className="cart-mod ">
        <h2 className="cart-mod-title">
          <i className="icon iconfont">&#xe624;</i> {'发票信息'}</h2>

        <p>{text}
          <a className="cart-invoice-edit" onClick={this.editInvoice}>
            <i className="fa fa-pencil"></i> {'修改'}</a>

        </p>
        <div className="container-fluid" id="invoiceEditor" style={{display: 'none'}}>
          <InvoiceEditor save={this.saveInvoice} unsave={this.unsaveInvoice}/>
        </div>
      </div>
    )
  }
});

//下单前计算总价
var CartSummaryForPay = React.createClass({
  getDefaultProps: function () {
    return {
      shipFee: 0,
      list: [],
      submitOrder: function () {
      }
    }
  },
  render: function () {
    var len = 0, totalPay = 0, shipFeeHtml = '';
    _.map(this.props.list, function (item) {
      len += parseInt(item['qty']);
      totalPay += parseInt(item['qty']) * parseFloat(item['price']);
    });
    var totalProductAmountString = '件商品，总商品金额';
    if (this.props.shipFee > 0) {
      shipFeeHtml = '￥' + this.props.shipFee;
    } else {
      shipFeeHtml = '包邮';
    }
    return (
      <div className="cart-mod cart-beforepay-summary">
        <dl className="col-md-12 ">
          <dt dangerouslySetInnerHTML={{
            __html: totalProductAmountString
          }}></dt>
          <dd>￥{totalPay}</dd>
        </dl>
        <dl className="col-md-12 ">
          <dt>{'运费'}</dt>
          <dd>{shipFeeHtml}</dd>
        </dl>
        <dl className="col-md-12 ">
          <dt>{'应付总额'}</dt>
          <dd>￥{parseFloat(totalPay) + parseFloat(this.props.shipFee)}</dd>
        </dl>
        <div className="col-md-12 clearfix cart-should-pay">
          <span>{'应付总额'} ￥{parseFloat(totalPay) + parseFloat(this.props.shipFee)}</span>
          <button type="button" className="btn" onClick={this.props.submitOrder}>{'提交订单'}</button>
        </div>
      </div>
    )
  }
});

//下单前，填信息界面
var CartToOrder = React.createClass({
  getDefaultProps: function () {
    return {
      list: []
    }
  },
  getInitialState: function () {
    return {
      shipFee: 0,
      productTotalFee: 0,
      selectedAddressId: '',
      selectedList: [],
      orderMemo: '',
      invoiceTitle: ''
    }
  },

  mixins: [Reflux.connect(CartStore), LinkedStateMixin],

  componentWillMount: function () {
    var selectedList = JSON.parse(localStorage.qwezst)['basketItems'];
    if (!_.isArray(selectedList) || selectedList.length == 0) {
      browserHistory.push('/shopping-cart');
    }
    var ptf = 0;
    _.map(selectedList, function (item) {
      ptf += parseInt(item['qty']) * parseFloat(item['price']);
    });
    CartStore.initProductTotalFee(ptf);
    this.setState({'productTotalFee': ptf});
  },

  componentDidMount() {
    var selectedList = JSON.parse(localStorage.qwezst)['basketItems'];
    this.setState({'selectedList': selectedList});
    $('.product-category').css('visibility', 'hidden');
  },

  submitOrder: function () {
    //CartActions.createOrder(this.state);
    var lineItems = [];
    _.map(this.state.selectedList, function (item) {
      lineItems.push({id: item['id'], quantity: item['qty']});
    });

    if(this.state.selectedAddressId) {
      CartActions.createOrder({
        order: {
          address_id: this.state.selectedAddressId,
          products: lineItems,
          ship_fee: this.state.shipFee
        }
      }, function (resp) {
        if (resp.order['sn']) {
          localStorage.qwezst = JSON.stringify({basketItems: []});
          if(mobileUtils.mobileCheck()) {
            localStorage.qwezstfp = JSON.stringify(resp.order);
            browserHistory.push('/order-pay/' + resp.order['sn']);
          }
          $('.cart-to-order-container').html('您的订单已提交，订单号：' + resp.order['sn'] + ', 支持货到付款');
        }
      });
    } else {
      layer.msg('请输入配送地址');
    }
  },
  render: function () {
    var containerClass = 'products-container' + (mobileUtils.mobileCheck() ? ' mobile-products-container' : '');

    return (
      <div className={containerClass}>
        <div className="cart-to-order-container">
          <div className="col-md-12">
            <MyAddressList />
          </div>
          <WaitingForPayCartItemList list={this.state.selectedList}/>
          <div className="row">
            <div className="col-xs-12">
              <CartSummaryForPay submitOrder={this.submitOrder} list={this.state.selectedList} shipFee={this.state.shipFee}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
});

export default CartToOrder