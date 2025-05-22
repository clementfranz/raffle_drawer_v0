import React from "react";

const Sec05_LicenseFeeAndRenewal = () => {
  return (
    <section>
      <div className="segment">
        <h1>5. License Fee and Renewal</h1>
      </div>

      <div className="segment indented">
        <h2>5.1 Standard License Fee:</h2>
        <p>
          The Licensee has paid a one-time license fee of <b>PHP 2,500</b> for
          the current License Period.
        </p>
      </div>

      <div className="segment indented">
        <h2>5.2 Renewal Terms:</h2>
        <p>
          Renewal discussions shall commence at least fifteen (15) days prior to
          the expiration of the current License Period. Renewal fees will be
          evaluated based on system usage, feature expansions, and draw volume,
          and are estimated to range between <b>PHP 20,000</b> and{" "}
          <b>PHP 50,000</b> per year.
        </p>
        <p>
          Failure to renew shall result in the automatic termination of access
          to the System without further notice.
        </p>
      </div>

      <div className="segment indented">
        <h2>5.3 Full Buyout Option:</h2>
        <p>
          The Licensee may opt to purchase a perpetual license to the System for
          a one-time payment of <b>PHP 80,000</b>. This includes:
        </p>
        <ul>
          <li>Lifetime access to the System</li>
          <li>
            Five (5) years of free system maintenance (excluding feature
            upgrades)
          </li>
          <li>Access to premium features, including but not limited to:</li>
          <ul>
            <li>Custom logo replacement</li>
            <li>License to integrate the System into other products</li>
            <li>Custom system title</li>
            <li>Custom video presentation</li>
          </ul>
        </ul>
        <p>
          This buyout option is available via one-time payment or installment
          plan (subject to applicable interest rates).
        </p>
        <p>
          <b>Note:</b> This offer is valid only until the expiration of the
          current License Period and may be withdrawn or revised at any time
          before acceptance.
        </p>
      </div>
    </section>
  );
};

export default Sec05_LicenseFeeAndRenewal;
