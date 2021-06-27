import React, { Component } from "react"

import Layout from "../components/Layout/Layout"
import CurrencyCard from "../components/CurrencyCard/CurrencyCard"
import LatestActivity from "../components/LatestActivity/LatestActivity"
import { Typography } from "@material-ui/core"
import SumExpansionPanel from "../components/TotalWalletValue/SumExpansionPanel"

export default class index extends Component {
  state = {
    addAmount: 0,
    activity: [],
    USD_wallet: 0,
    EUR_wallet: 0,
    MDL_wallet: 0,
    totalValueUSD: null,
  }

  //THIS FUNCTION HANDLES CHANGE OF INPUT FIELDS AND ADDS IT TO THE STATE
  handleChange = async e => {
    e.preventDefault()
    let { name, value } = e.target

    await this.setState({ [name]: value })
    console.log(this.state)
  }

  //THIS FUNCTION HANDLES THE ADDITION OF CURRENCY TO RESPECTIVE WALLETS
  handleAddCurrency = async (e, prefix) => {
    let { USD_wallet, EUR_wallet, MDL_wallet, addAmount } = this.state
    e.preventDefault()
    console.log(prefix)
    console.log("The ADD button was pressed")
    let date = Date()
    let newActivityString = date + ": Added: " + addAmount + prefix
    console.log(newActivityString)
    switch (prefix) {
      case "USD":
        //PUSH THE ADDED AMOUNT TO DATABASE
        await this.setState({
          USD_wallet: parseInt(USD_wallet) + parseInt(addAmount),
          activity: [newActivityString, ...this.state.activity],
          AddAmount: 0,
        })
        this.calculateTotalSumInDollars()
        break
      case "EUR":
        //PUSH THE ADDED AMOUNT TO DATABASE
        await this.setState({
          EUR_wallet: parseInt(EUR_wallet) + parseInt(addAmount),
          activity: [newActivityString, ...this.state.activity],
          AddAmount: 0,
        })
        this.calculateTotalSumInDollars()
        break
      case "MDL":
        //PUSH THE ADDED AMOUNT TO DATABASE
        await this.setState({
          MDL_wallet: parseInt(MDL_wallet) + parseInt(addAmount),
          activity: [newActivityString, ...this.state.activity],
          AddAmount: 0,
        })
        this.calculateTotalSumInDollars()
        break
      default:
        //CREATE AN ERROR MESSAGE
        break
    }
  }

  //THIS FUNCTION HANDLES CONVERSION BETWEEN CURRENCIES
  handleConvert = (originalCurrency, originalCurrencyAmount, currency) => {
    console.log("We are now in the handleConvert function")
    console.log("We have received the following:")
    console.log("Convert From: " + originalCurrency)
    console.log("The amount to be converted: " + originalCurrencyAmount)
    console.log("Into: " + currency)

    //PULL VARIABLED OUT OF THE STATE
    let { USD_wallet, EUR_wallet, MDL_wallet } = this.state

    //USE THIS DATE TO MARK THE TIME OF THE CONVERSION
    let date = Date()

    //UPDATE ACTIVITY ARRAY
    this.setState({
      activity: [
        date +
          ": Converted: " +
          originalCurrencyAmount +
          originalCurrency +
          " to " +
          currency,
        ...this.state.activity,
      ],
    })

    //THIS BLOCK DETERMINES THE RIGHT CONVERSTION TO MAKE AND SUBTRACTS FROM ORIGIN
    switch (originalCurrency) {
      //IF ORIGINAL CURRENCY IS USD
      case "USD":
        this.setState({ USD_wallet: USD_wallet - originalCurrencyAmount })
        //AND WE ARE CONVERTING TO EUR
        if (currency === "EUR") {
          let newAmount = this.convertUSDtoEUR(originalCurrencyAmount)
          this.setState({
            EUR_wallet: EUR_wallet + newAmount,
          })
          //AND WE ARE CONVERTING TO MDL
        } else {
          let newAmount = this.convertUSDtoMDL(originalCurrencyAmount)
          this.setState({ MDL_wallet: MDL_wallet + newAmount })
        }
        break

      //IF ORIGINAL CURRENCY IS EUR
      case "EUR":
        console.log("Starting to convert from EUR")
        this.setState({ EUR_wallet: EUR_wallet - originalCurrencyAmount })
        //AND WE ARE CONVERTING TO USD
        if (currency === "USD") {
          let newAmount = this.convertEURtoUSD(originalCurrencyAmount)
          this.setState({ USD_wallet: USD_wallet + newAmount })
          //AND WE ARE CONVERTING TO MDL
        } else {
          let newAmount = this.convertEURtoMDL(originalCurrencyAmount)
          this.setState({ MDL_wallet: MDL_wallet + newAmount })
        }
        break

      //IF ORIGINAL CURRENCY IS MDL
      case "MDL":
        console.log("Starting to convert from MDL")
        this.setState({ MDL_wallet: MDL_wallet - originalCurrencyAmount })
        //AND WE ARE CONVERTING TO USD
        if (currency === "USD") {
          let newAmount = this.convertMDLtoUSD(originalCurrencyAmount)
          this.setState({ USD_wallet: USD_wallet + newAmount })
          //AND WE ARE CONVERTING TO EUR
        } else {
          let newAmount = this.convertMDLtoEUR(originalCurrencyAmount)
          this.setState({ EUR_wallet: EUR_wallet + newAmount })
        }
        break
      default:
        //LOG ERROR MESSAGE IF NONE OF THE OTHER CASES ARE TRUE
        break
    }
    //WE DO NOT NEED TO UPDATE THE TOTAL USD SUM SINCE WE ONLY CONVERTED BETWEEN WALLETS
  }

  //-------------------- HELPER FUNCTIONS ---------------------
  //###### FROM USD TO OTHER CURRENCIES FUNCTIONS##############

  //THIS FUNCTION CONVERTS USD TO EUR
  convertUSDtoEUR = amount => {
    let USDtoEUR_Rate = 0.9
    let res = amount * USDtoEUR_Rate
    return res
  }

  //THIS FUNCTION CONVERTS USD TO MDL
  convertUSDtoMDL = amount => {
    let USDtoMDL_Rate = 18.04
    let res = amount * USDtoMDL_Rate
    return res
  }

  //###### FROM EUR TO OTHER CURRENCIES FUNCTIONS ###############

  //THIS FUNCTION CONVERTS EUR TO USD
  convertEURtoUSD = amount => {
    //TODO: GET FRESH RATES FROM AN API
    let EURtoUSD_Rate = 1.12
    let res = amount * EURtoUSD_Rate
    return res
  }

  //THIS FUNCTION CONVERTS EUR TO MDL
  convertEURtoMDL = amount => {
    let EURtoMDL_Rate = 21.05
    let res = amount * EURtoMDL_Rate
    return res
  }

  //##### FROM MDL TO OTHER CURRENCIES FUNCTIONS

  //THIS FUNCTION CONVERTS MDL TO USD
  convertMDLtoUSD = amount => {
    //TODO: GET FRESH RATES FROM AN API
    let MDLtoUSD_Rate = 0.056
    let res = amount * MDLtoUSD_Rate
    return res
  }

  //THIS FUNCTION CONVERTS MDL TO EUR
  convertMDLtoEUR = amount => {
    let MDLtoEUR_Rate = 0.047
    let res = amount * MDLtoEUR_Rate
    return res
  }

  //THIS FUNCTION CALCULATES THE SUM OF CURRENCIES IN USD
  calculateTotalSumInDollars = () => {
    let { USD_wallet, EUR_wallet, MDL_wallet } = this.state
    let sum =
      USD_wallet +
      this.convertEURtoUSD(EUR_wallet) +
      this.convertMDLtoUSD(MDL_wallet)
    console.log("Sum in USD: " + sum)
    this.setState({ totalValueUSD: sum })
  }

  componentWillMount() {
    //FETCH USER DATA FROM DATABASE AND FEED INTO STATE

    //CALCULATE THE TOTAL AMOUNT IN USD WHICH UPDATES THE STATE VALUE
    this.calculateTotalSumInDollars()
  }

  render() {
    return (
      <div>
        <Layout>
          <Typography>
           
          </Typography>
          {/* THIS COMPONENT DISPLAYS THE SUM OF CURRENCIES IN USD AT THE TOP OF THE PAGE */}
          <SumExpansionPanel
            convertUSDtoEUR={this.convertUSDtoEUR}
            convertUSDtoMDL={this.convertUSDtoMDL}
            sum={this.state.totalValueUSD}
          />

          {/*THIS IS THE CURRENCY CARD/WALLET DISPLAY FOR USD */}
          <CurrencyCard
            prefix={"USD"}
            currencyName={"US Dollars"}
            balance={this.state.USD_wallet}
            handleChange={this.handleChange}
            handleAddCurrency={this.handleAddCurrency}
            handleConvert={this.handleConvert}
          />

          {/*THIS IS THE CURRENCY CARD/WALLET DISPLAY FOR EUR */}
          <CurrencyCard
            prefix={"EUR"}
            currencyName={"EURO"}
            balance={this.state.EUR_wallet}
            handleChange={this.handleChange}
            handleAddCurrency={this.handleAddCurrency}
            handleConvert={this.handleConvert}
          />

          {/*THIS IS THE CURRENCY CARD/WALLET DISPLAY FOR MDL */}
          <CurrencyCard
            prefix={"MDL"}
            currencyName={"Moldovian LEI"}
            balance={this.state.MDL_wallet}
            handleChange={this.handleChange}
            handleAddCurrency={this.handleAddCurrency}
            handleConvert={this.handleConvert}
          />

          {/*THIS COMPONENT MAPS THROUGH THE ACTIVITY ARRAY AND DISPLAYS
            THEM UNDER THE CURRENCY CARDS*/}
          <LatestActivity activity={this.state.activity} />
        </Layout>
      </div>
    )
  }
}
