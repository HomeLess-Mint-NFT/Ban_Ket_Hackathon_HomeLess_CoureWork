import Time "mo:base/Time";
import TrieSet "mo:base/TrieSet";

module {
    public type Metadata = {
        logo: Text;
        name: Text;
        symbol: Text;
        desc: Text;
        totalSupply: Nat;
        owner: Principal;
        cycles: Nat;
    };

    public type Location = {
        #InCanister: Blob; // NFT encoded data
        #AssetCanister: (Principal, Blob); // asset canister id, storage key
        #IPFS: Text; // IPFS content hash
        #Web: Text; // URL pointing to the file
    };
    public type Attribute = {
        key: Text;
        value: Text;
    };
    public type TokenMetadata = {
        tokenUri: Text;
    };

    public type TokenInfo = {
        index: Nat;
        var owner: Principal;
        var metadata: ?TokenMetadata;
        var operator: ?Principal;
        timestamp: Time.Time;
    };

    public type TokenInfoExt = {
        index: Nat;
        owner: Principal;
        metadata: ?TokenMetadata;
        operator: ?Principal;
        timestamp: Time.Time;
    };

    public type UserInfo = {
        var operators : TrieSet.Set<Principal>; 
        var allowedBy : TrieSet.Set<Principal>; 
        var allowedTokens: TrieSet.Set<Nat>;   
        var name : TrieSet.Set<Text>;     // principals allowed to operate on the user's behalf
        var birthday: TrieSet.Set<Text>;     // principals approved user to operate their's tokens
        var phone : TrieSet.Set<Nat>;
        var sex : TrieSet.Set<Text>;       // tokens the user can operate
        var tokens: TrieSet.Set<Nat>;              // user's tokens
    };

    public type UserInfoExt = {
        operators: [Principal];
        allowedBy: [Principal];
        allowedTokens: [Nat];
        tokens: [Nat];
    };

    public type OrderInfo = {
        price: Nat;
        index: Nat;
        owner: Principal;
    };

    /// Update call operations
    public type Operation = {
        #mint: ?TokenMetadata;  
        #burn;
        #transfer;
        #transferFrom;
        #approve;
        #approveAll;
        #revokeAll; // revoke approvals
        #setMetadata;
        #createOrder
    };
    /// Update call operation record fields
    public type Record = {
        #user: Principal;
        #metadata: ?TokenMetadata; // op == #setMetadata
    };
    public type TxRecord = {
        caller: Principal;
        op: Operation;
        index: Nat;
        tokenIndex: ?Nat;
        from: Record;
        to: Record;
        timestamp: Time.Time;
    };
};