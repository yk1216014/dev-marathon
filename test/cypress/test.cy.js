describe('顧客情報入力フォームのテスト', () => {
  it('顧客情報を入力して送信し、確認画面を経て完了メッセージを確認する', () => {
    // 1. 入力画面にアクセス
    cy.visit('http://127.0.0.1:5465/customer/add.html');

    cy.window().then((win) => {
      // alertをスタブ化
      cy.stub(win, 'alert').as('alertStub');
    });

    const data = {
      companyName: '株式会社テスト',
      industry: 'IT通信',
      location: '東京都渋谷区'
    };
    const uniqueContactNumber = `03-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 2. フォーム入力
    cy.get('#companyName').type(data.companyName);
    cy.get('#industry').type(data.industry);
    cy.get('#contact').type(uniqueContactNumber);
    cy.get('#location').type(data.location);

    // 3. 送信 (確認画面へ遷移)
    cy.get('#project-form').submit();

    // 4. 確認画面への遷移を待機・確認
    cy.url().should('include', 'add-confirm.html');
    cy.get('#display-companyName').should('contain', data.companyName);

    // 5. 登録確定ボタンをクリック
    cy.get('#btn-submit').click();

    // 6. 完了アラートの確認
    // 文言修正：「顧客情報が正常に保存されました。」に変更
    cy.get('@alertStub').should('have.been.calledOnceWith', '登録が完了しました！');

    // 7. リスト画面への遷移を確認
    cy.url().should('include', 'list.html');
  });
});