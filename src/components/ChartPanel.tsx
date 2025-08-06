import React from "react";
import GraphPayoff from "./GraphPayoff";
import GraphGreek from "./GraphGreek";
import "../styles/chart.css";

const ChartPanel = () => {
    return (
        <div className="chart-panel">
            <div className="chart-title">Final Payoff Curve</div>
            <div className="graph-section">
                <GraphPayoff />
            </div>
            <div className="chart-title">Greeks</div>
            <div className="greek-graphs">
                <GraphGreek greekName="Greek 1" />
                <GraphGreek greekName="Greek 2" />
            </div>
        </div>
    );
};

export default ChartPanel;
