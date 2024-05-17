//讀取合約以太幣餘額
async function contract_getContractBalance(contract)
{
    try {
        var data = await contract.methods.getContractBalance().call();
        return data;
    } catch (error) {
        console.log(error);
        alert("執行getContractBalance失敗");
    }
}

//查詢合約管理者帳戶
async function contract_getContractOwner(contract)
{
    try {
        var data = await contract.methods.getContractOwner().call();
        return data;
    } catch (error) {
        console.log(error);
        alert("執行getContractOwner失敗");
    }
}

//設定合約管理者
async function contract_setContractOwner(contract, account)
{
    try {
        await contract.methods.setContractOwner(account).send({from: web3.eth.defaultAccount, gas:1000000});
    } catch (error) {
        console.log(error);
        alert("執行setContractOwner失敗");
    }
}

//查詢代幣的名稱
async function contract_name(contract)
{
    try {
        var data = await contract.methods.name().call();
        return data;
    } catch (error) {
        console.log(error);
        alert("執行name失敗");
    }
}

//查詢代幣的代稱
async function contract_symbol(contract)
{
    try {
        var data = await contract.methods.symbol().call();
        return data;
    } catch (error) {
        console.log(error);
        alert("執行symbol失敗");
    }
}

//查詢代幣的總發行量
async function contract_totalSupply(contract)
{
    try {
        var data = await contract.methods.totalSupply().call();
        return data;
    } catch (error) {
        console.log(error);
        alert("執行totalSupply失敗");
    }
}

//鑄幣
async function contract_mint(contract, uri, value)
{
    try {
        await contract.methods.mint(uri).send({from: web3.eth.defaultAccount, value: value, gas:1000000});
    } catch (error) {
        console.log(error);
        alert("執行mint失敗");
    }
}

//依據索引值查詢Token ID
async function contract_tokenByIndex(contract, index)
{
    try {
        var data = await contract.methods.tokenByIndex(index).call();
        return data;
    } catch (error) {
        console.log(error);
        alert("執行tokenByIndex失敗");
    }
}

//查詢Token的持有者帳戶
async function contract_ownerOf(contract, tokenId)
{
    try {
        var data = await contract.methods.ownerOf(tokenId).call();
        return data;
    } catch (error) {
        console.log(error);
        alert("執行ownerOf失敗");
    }
}


//查詢使用者有沒有持有本系列任何Token
async function contract_token_owner(contract, tokenId)
{

    try {
        var data = await contract.methods.ownerOf(tokenId).call();
        return data;
    } catch (error) {
        console.log(error);
       // alert("Not a ownerOf stickman series");
    }
}


//查詢代幣的資源URI
async function contract_tokenURI(contract, tokenId)
{
    try {
        var data = await contract.methods.tokenURI(tokenId).call();
        return data;
    } catch (error) {
        console.log(error);
        alert("執行tokenURI失敗");
    }
}