import { before, after, describe, it } from 'mocha'
import { expect, assert, should } from 'chai'
import sinon from 'sinon'

import { wx } from '../wx'
import { getCurrentPages } from '../mini-program'
import { vxapp } from '../vxapp'

global.wx = wx
global.getCurrentPages = getCurrentPages

describe('native wrapper', function() {
  class appForTest extends vxapp.App {}
  let app
  let sandbox

  beforeEach(function() {
    app = new appForTest
    sandbox = sinon.sandbox.create()
  })

  afterEach(function() {
    app = null
    sandbox.restore()
  })

  describe('#system', function() {
    it('should call getSystemInfo to get data', function() {
      const ret = {
        name: 'wechat'
      }
      sandbox.stub(wx, 'getSystemInfo')
      .yieldsTo('success', ret)

      return app.system()
      .then(res => {
        sinon.assert.called(wx.getSystemInfo)
        expect(res).to.deep.equal(ret)
      })
    })
  })

  describe('#network', function() {
    it('should call getNetworkType to get data', function() {
      const ret = 'wifi'
      sandbox.stub(wx, 'getNetworkType')
      .yieldsTo('success', ret)

      return app.network()
      .then(res => {
        sinon.assert.called(wx.getNetworkType)
        expect(res).to.deep.equal(ret)
      })
    })
  })

  describe('#toast', function() {
    it('should call showToast', function() {
      const ret = {
        duration: 2000,
        icon: 'loading',
        title: 'this is message'
      }
      sandbox.stub(wx, 'showToast')
      .yieldsTo('success', ret)

      return app.toast(ret.title)
      .then(res => {
        sinon.assert.calledWithMatch(wx.showToast, ret)
      })
    })
  })

  describe('#dialog', function() {
    it('should call showModal', function() {
      const ret = {
        title: 'this is title',
        content: 'this is content'
      }
      sandbox.stub(wx, 'showModal')
      .yieldsTo('success', ret)

      return app.dialog(ret.title, ret.content)
      .then(res => {
        sinon.assert.calledWithMatch(wx.showModal, ret)
      })
    })
  })

  describe('#menu', function() {
    it('should call showActionSheet', function() {
      const ret = {
        itemList: [
          'a',
          'b',
          'c'
        ]
      }
      sandbox.stub(wx, 'showActionSheet')
      .yieldsTo('success', ret)

      return app.menu(ret.itemList)
      .then(res => {
        sinon.assert.calledWithMatch(wx.showActionSheet, ret)
      })
    })
  })

  describe('#location', function() {
    it('should call getLocation', function() {
      const ret = {}
      sandbox.stub(wx, 'getLocation')
      .yieldsTo('success', ret)

      return app.location(ret)
      .then(res => {
        sinon.assert.calledWithMatch(wx.getLocation, ret)
      })
    })
  })

  describe('#user', function() {
    it('should call login and getUserInfo', function() {
      const ret0 = { code: 200 }
      const ret1 = { name: 'wechat' }
      sandbox.stub(wx, 'login')
      .yieldsTo('success', ret0)
      sandbox.stub(wx, 'getUserInfo')
      .yieldsTo('success', ret1)

      return app.user()
      .then(res => {
        sinon.assert.called(wx.login)
        sinon.assert.called(wx.getUserInfo)
        sinon.assert.match(res, {...ret0, ...ret1})
      })
    })
  })

  describe('#title', function() {
    it('should call setNavigationBarTitle', function() {
      const ret = {
        title: 'this is title'
      }
      sandbox.stub(wx, 'setNavigationBarTitle')

      app.title(ret.title)

      sinon.assert.calledWithMatch(wx.setNavigationBarTitle, ret)
    })
  })

  describe('#pages', function() {
    const ret = [1, 2, 3]
    let getpages = sinon.sandbox.create()

    beforeEach(function() {
      getpages.stub(global, 'getCurrentPages')
      .callsFake(function(i) {
        return i ? ret[i] : ret
      })
    })

    afterEach(function() {
      getpages.restore()
    })

    context('when called without argument', function() {
      it('should get all pages', function() {
        expect(app.pages()).to.deep.equal(ret)
      })
    })

    context('when called with positive index', function() {
      it('should get one page', function() {
        expect(app.pages(1)).to.equal(ret[1])
      })
    })

    context('when called with negative index', function() {
      it('should get one page', function() {
        expect(app.pages(-1)).to.equal(ret[2])
      })
    })
    
  })
})