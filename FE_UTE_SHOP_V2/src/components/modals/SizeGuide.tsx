"use client";

export default function SizeGuide() {
  return (
    <div className="modal fade modalCentered modal-find-size" id="sizeGuide">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="header">
            <div className="heading">Hướng dẫn chọn size</div>
            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
            />
          </div>
          <div className="tf-rte">
            <div className="tf-table-res-df">
              <div className="title">Bảng hướng dẫn chọn size</div>
              <table className="tf-sizeguide-table">
                <thead>
                  <tr>
                    <th>Size</th>
                    <th>US</th>
                    <th>Ngực</th>
                    <th>Eo</th>
                    <th>Mông</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>XS</td>
                    <td>2</td>
                    <td>32</td>
                    <td>24 - 25</td>
                    <td>33 - 34</td>
                  </tr>
                  <tr>
                    <td>S</td>
                    <td>4</td>
                    <td>34 - 35</td>
                    <td>26 - 27</td>
                    <td>35 - 36</td>
                  </tr>
                  <tr>
                    <td>M</td>
                    <td>6</td>
                    <td>36 - 37</td>
                    <td>28 - 29</td>
                    <td>38 - 40</td>
                  </tr>
                  <tr>
                    <td>L</td>
                    <td>8</td>
                    <td>38 - 39</td>
                    <td>30 - 31</td>
                    <td>42 - 44</td>
                  </tr>
                  <tr>
                    <td>XL</td>
                    <td>10</td>
                    <td>40 - 41</td>
                    <td>32 - 33</td>
                    <td>45 - 47</td>
                  </tr>
                  <tr>
                    <td>XXL</td>
                    <td>12</td>
                    <td>42 - 43</td>
                    <td>34 - 35</td>
                    <td>48 - 50</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="tf-page-size-chart-content">
              <div>
                <div className="title">Hướng dẫn đo size</div>
                <ul>
                  <li className="text">1. Ngực</li>
                  <li className="text-main">
                    Đo vòng ngực tại điểm đầy nhất, giữ thước song song với sàn.
                  </li>
                  <li className="text">2. Eo</li>
                  <li className="text-main">
                    Đo vòng eo tại phần nhỏ nhất của eo, thường nằm dưới xương sườn và trên xương hông.
                  </li>
                  <li className="text">3. Mông</li>
                  <li className="text-main">
                    Đo vòng mông tại điểm đầy nhất, giữ thước song song với sàn.
                  </li>
                </ul>
              </div>
              <div className="text-md-end text-center">
                <img
                  className="sizechart lazyload"
                  data-src="/images/section/size-guide.png"
                  alt="Bảng hướng dẫn chọn size"
                  src="/images/section/size-guide.png"
                  width={258}
                  height={297}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
