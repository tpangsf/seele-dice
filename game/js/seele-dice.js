/* 
author: Miya_yang
time:2018.10.11
*/
const dice = require('dice2.js')
const seeleutil = require('seele-util.js')
const LOADING_SECONDS = 60
let printResultID, resultTimeOutID
$(document).ready(function ($) {
  // tab
  $('#tab').tabulous({
    effect: 'slideLeft'
  })

  // Initial bet amount
  $('.getVal').val(0.5)

  // transaction popup
  $('.rollButton button').click(function () {
    // pulic
    var bet = $('.getVal').val()
    var roll = $('.setWin').text()
    var payout = $('.winSeele').text()
    var gasPricePost = 1
    var gasLimitPost = 3000000
    if (bet == '') {
      $('.result').show()
      $('.result').text('Please bet first.')
      setTimeout(function () {
        $('.result').hide()
      }, 2000)
      return false
    } else if (roll == '0') {
      $('.result').show()
      $('.result').text('Please play a game first.')
      setTimeout(function () {
        $('.result').hide()
      }, 2000)
      return false
    }
    // get username
    var getStorageUsername = GetUserKeyPair().PublicKey

    $('.from').text(getStorageUsername)
    $('.betAmount').text(bet)
    $('.payOut').text(payout)
    $('.gasPrice').val(gasPricePost)
    $('.gasLimit').val(gasLimitPost)
    $('.rollUnder').text(roll)

    // get nonce
    dice.GetAccountNonce(getStorageUsername).then(nonce => {
      $('.transactionMain table tr:nth-child(4) td:nth-child(2)').text(nonce)
    }).catch(err => {console.log(err)})
    $('.transaction').show()
  })
  // close transction
  $('.transaction ul li:nth-child(1) button,.transaction .close').click(function () {
    $('.transaction').hide()
  })
  // post transction data
  $('.transaction ul li:nth-child(2) button').click(function () {
    reRollResult()
    $('.transaction').hide()
  })
  // close playPopup
  $('.playPopup .close').click(function () {
    $('.playPopup').hide()
  })
  // show how to play
  $('.play').click(function () {
    $('.playPopup').show()
  })
  $('.getImageName').change(function () {
    var str = $(this).val()
    var fileName = getFileName(str)
    var fileExt = str.substring(str.lastIndexOf('.') + 1)
    $('.setImageName').val(fileName)
    // console.log(fileName + '\r\n' + fileExt);
  })
})

function reRollResult() {
    // post data
    var gasPrice = $('.gasPrice').val()
    var gasLimit = $('.gasLimit').val()
    var rollUnder = $('.rollUnder').text()

    // sendTx
    let keypair = GetUserKeyPair()
    var args = {
      'RollUnder': Number(rollUnder),
      'Bet': Number(seeleutil.toFan($('.betAmount').text())),
      'GasPrice': Number(gasPrice),
      'GasLimit': Number(gasLimit)
    }
    let err = dice.RollForQuick(keypair, args)
    if (err){
        $('.result').show()
        $('.dask').show()
        $('.result').text(err)
        return
    }
    let count = LOADING_SECONDS
    printResultID = setInterval(()=>{
        $('.result').show()
        $('.dask').show()
        $('.result').text('Loading results(' + count + 's)...')
        count -= 1
    }, 1000)
    resultTimeOutID = setTimeout(() => {
        $('.result').hide()
        $('.dask').hide()
        clearInterval(printResultID)
        clearTimeout(resultTimeOutID)
    }, LOADING_SECONDS*1000)
}

// get file name
function getFileName(path) {
    var pos1 = path.lastIndexOf('/')
    var pos2 = path.lastIndexOf('\\')
    var pos = Math.max(pos1, pos2)
    if (pos < 0) {
        return path
    } else {
        return path.substring(pos + 1)
    }
}
