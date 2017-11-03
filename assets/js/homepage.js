var last_price = 0;
var first_run = 1;

$(document).ready(function() {
    // get initial details
    // updatePrices();
    // updateOrderbook();

    // automatically update page every minute
    //setInterval(function(){
        //updatePrices();
        //updateOrderbook();
    //}, 90000);

    $('#executeBuy').click(function(e) {
        e.preventDefault();
        executeBuy();
    });

    $('#executeSell').click(function(e) {
        e.preventDefault();
        executeSell();
    });
});

function updatePrices() {
    // send logout request
    $.post('/php/price-get.php', {}, function(response) {
        var response = jQuery.parseJSON(response);

        if (response.success) {
            // rebuild price history table
            var code = '';
            var rowCode = '<tr><th scope="row"><!--price_id--></th><td><!--time--></td><td class="<!--text_color-->"><!--usd_value--> <i class="fa <!--fa_icon-->" aria-hidden="true"></i></td></tr>';
            for (i in response.prices) {
                i = parseInt(i);

                temp = rowCode
                    .replace('<!--price_id-->', response.prices[i].price_id)
                    .replace('<!--time-->', response.prices[i].time)
                    .replace('<!--usd_value-->', response.prices[i].usd_value);

                if (response.prices[i + 1] === undefined) {
                    temp = temp
                        .replace('<!--text_color-->', '')
                        .replace('<!--fa_icon-->', 'fa-minus-circle');
                } else if (response.prices[i].usd_value > response.prices[i + 1].usd_value) {
                    temp = temp
                    .replace('<!--text_color-->', 'text-success')
                    .replace('<!--fa_icon-->', 'fa-chevron-circle-up');
                } else if (response.prices[i].usd_value < response.prices[i + 1].usd_value) {
                    temp = temp
                    .replace('<!--text_color-->', 'text-danger')
                    .replace('<!--fa_icon-->', 'fa-chevron-circle-down');
                } else {
                    temp = temp
                        .replace('<!--text_color-->', '')
                        .replace('<!--fa_icon-->', 'fa-minus-circle');
                }

                code += temp;
            }
            $('#priceHistory').html(code);

            if (response.prices[0].usd_value != last_price) {
                $.notify({
                    message: 'BTC is now trading for $' + response.prices[0].usd_value + '.'
                },{
                    type: 'info',
                    newest_on_top: false,
                    placement: {
                        from: "top",
                        align: "center"
                    }
                });
            }

            last_price = response.prices[0].usd_value;
        } else {
            $.notify({
                title: '<b>Failed to get price history</b>',
                message: 'There was a problem retrieving the price history, please refresh the page.'
            },{
                type: 'danger',
                newest_on_top: false,
                placement: {
                    from: "top",
                    align: "center"
                }
            });
        }
    });
}

function updateOrderbook() {
    // send logout request
    $.post('/php/order-get.php', {}, function(response) {
        var response = jQuery.parseJSON(response);

        if (response.success) {
            // rebuild price history table
            var code = '';
            var rowCode = '<tr class="<!--row_color-->"><th scope="row"><!--order_id--></th><td><!--time--></td><td><!--order_type--></td><td class="text-right"><!--num_shares--></td><td><!--coin_symbol--></td><td class="text-right"><!--usd_value--></td><td class="text-right"><!--balance_usd--></td><td class="text-right"><!--balance_coin--></td><td><!--coin_symbol--></td></tr>';
            for (i in response.orders) {
                i = parseInt(i);

                temp = rowCode
                    .replace('<!--order_id-->', response.orders[i].order_id)
                    .replace('<!--time-->', response.orders[i].time)
                    .replace('<!--usd_value-->', response.orders[i].usd_value)
                    .replace('<!--order_type-->', response.orders[i].order_type)
                    .replace('<!--num_shares-->', response.orders[i].num_shares)
                    .replace('<!--coin_symbol-->', response.orders[i].coin_symbol)
                    .replace('<!--balance_usd-->', response.orders[i].balance_usd)
                    .replace('<!--balance_coin-->', response.orders[i].balance_coin);

                if (response.orders[i].order_type == 'BUY') {
                    temp = temp.replace('<!--row_color-->', 'table-success');
                } else if (response.orders[i].order_type == 'SELL') {
                    temp = temp.replace('<!--row_color-->', 'table-danger');
                } else {
                    temp = temp.replace('<!--row_color-->', '');
                }


                code += temp;
            }
            $('#orderHistory').html(code);

            if (first_run && response.orders[0].order_type == 'INIT') {
                $.notify({
                    title: '<b>Starting Balance</b>',
                    message: 'Your account has been created with an initial starting balance of $5000, have fun!'
                },{
                    type: 'primary',
                    newest_on_top: false,
                    delay: 10000,
                    placement: {
                        from: "top",
                        align: "center"
                    }
                });
            }
        } else {
            $.notify({
                title: '<b>Failed to get price history</b>',
                message: 'There was a problem retrieving the price history, please refresh the page.'
            },{
                type: 'danger',
                newest_on_top: false,
                placement: {
                    from: "top",
                    align: "center"
                }
            });
        }
    });
}

function executeBuy() {
    // send logout request
    $.post('/php/order-buy.php', {
        num_dollars: $('#buyAmount').val(),
        coin_symbol: 'BTC'
    }, function(response) {
        var response = jQuery.parseJSON(response);

        updateOrderbook();

        if (response.success) {
            $.notify({
                title: '<b>BUY</b>',
                message: ' of ' + response.num_shares + ' BTC executed at a price of $' + response.usd_value + '!'
            },{
                type: 'success',
                newest_on_top: false,
                placement: {
                    from: "top",
                    align: "center"
                }
            });
        } else {
            if (response.error == 'insufficient_funds') {
                $.notify({
                    title: '<b>Insufficient funds</b>',
                	message: 'You tried to execute a trade that costs $' + response.num_dollars + ' but you only have $' + response.balance_usd + '.'
                },{
                	type: 'warning',
                    newest_on_top: false,
                    placement: {
                		from: "top",
                		align: "center"
                	}
                });
            } else if (response.error == 'minimum_trade') {
                $.notify({
                    title: '<b>Minimum trade</b>',
                	message: 'Please enter a trade of at least $0.01.'
                },{
                	type: 'warning',
                    newest_on_top: false,
                    placement: {
                		from: "top",
                		align: "center"
                	}
                });
            } else {
                $.notify({
                    title: '<b>Buy failed</b>',
                    message: 'There was a problem executing your trade, please try again'
                },{
                    type: 'warning',
                    newest_on_top: false,
                    placement: {
                        from: "top",
                        align: "center"
                    }
                });
            }
        }
    });
}

function executeSell() {
    // send logout request
    $.post('/php/order-sell.php', {
        num_shares: $('#sellAmount').val(),
        coin_symbol: 'BTC'
    }, function(response) {
        var response = jQuery.parseJSON(response);

        updateOrderbook();

        if (response.success) {
            $.notify({
                title: '<b>SELL</b>',
                message: ' of ' + response.num_shares + ' BTC executed at a price of $' + response.usd_value + '!'
            },{
                type: 'danger',
                newest_on_top: false,
                placement: {
                    from: "top",
                    align: "center"
                }
            });
        } else {
            if (response.error == 'insufficient_funds') {
                $.notify({
                    title: '<b>Insufficient funds</b>',
                	message: 'You tried to execute a trade that costs ' + response.num_shares + ' BTC but you only have ' + response.balance_coin + ' BTC.'
                },{
                	type: 'warning',
                    newest_on_top: false,
                    placement: {
                		from: "top",
                		align: "center"
                	}
                });
            } else if (response.error == 'minimum_trade_usd') {
                $.notify({
                    title: '<b>Minimum trade</b>',
                	message: 'Please enter a trade of at least ' + response.min_trade + ' BTC.'
                },{
                	type: 'warning',
                    newest_on_top: false,
                    placement: {
                		from: "top",
                		align: "center"
                	}
                });
            } else if (response.error == 'minimum_trade_btc') {
                $.notify({
                    title: '<b>Minimum trade</b>',
                	message: 'Please enter a larger trade amount.'
                },{
                	type: 'warning',
                    newest_on_top: false,
                    placement: {
                		from: "top",
                		align: "center"
                	}
                });
            } else {
                $.notify({
                    title: '<b>Sell failed</b>',
                    message: 'There was a problem executing your trade, please try again'
                },{
                    type: 'warning',
                    newest_on_top: false,
                    placement: {
                        from: "top",
                        align: "center"
                    }
                });
            }
        }
    });
}
